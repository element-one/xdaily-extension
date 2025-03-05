import type { ToastProps } from "~contents/toast"
import { collectTweet, subscribeTweetUser } from "~services/tweet"
import { MessageType } from "~types/enum"

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

const showToastInWebPage = (message: ToastProps) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: MessageType.INPAGE_TOAST,
        message: message
      })
    }
  })
}

// control side panel open state
let isSidePanelOpen = false
chrome.action.onClicked.addListener(() => {
  isSidePanelOpen = !isSidePanelOpen
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))
})

// listen to message
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.type) {
    case MessageType.SAVE_TWEET:
      const tweetId = message.tweetId
      try {
        console.log("use this tweetId", tweetId)
        if (tweetId) {
          const res = await collectTweet({ tweetId })
          console.log("testing", res)
          showToastInWebPage({
            message: `save tweetId ${tweetId} success`
          })
          // tell the search panel to refetch collection or add to top
          // TODO
          chrome.runtime.sendMessage({
            type: MessageType.REFETCH_COLLECTION
          })
        }
      } catch (e) {
        console.log(e)
        showToastInWebPage({
          message: "Something wrong",
          type: "error"
        })
      }
      sendResponse("complete")
      break
    case MessageType.SUBSCRIBE_USER:
      const userId = message.userId
      try {
        if (userId) {
          const res = await subscribeTweetUser({ tweetUserId: userId })
          if (res) {
            showToastInWebPage({
              message: `Subscribe to @${userId} success`
            })
          }
        }
      } catch (e) {
        console.log(e)
        showToastInWebPage({
          message: "Something wrong",
          type: "error"
        })
      }
      sendResponse("complete")
      break
    case MessageType.TOGGLE_PANEL:
      if (isSidePanelOpen) {
        // tell side bar to close itself
        chrome.runtime.sendMessage({
          type: MessageType.SIDE_PANEL_CLOSE_ITSELF
        })
      } else {
        await chrome.sidePanel.open({ tabId: sender.tab.id })
      }
      isSidePanelOpen = !isSidePanelOpen
      break
    default:
      break
  }
})

chrome.cookies.onChanged.addListener((changeInfo) => {
  if (
    changeInfo.cookie.domain.includes(process.env.PLASMO_PUBLIC_COOKIE_SERVER)
  ) {
    chrome.runtime.sendMessage({
      type: MessageType.CHECK_AUTH
    })
  }
})
