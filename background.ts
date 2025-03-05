import type { ToastProps } from "~contents/toast"
import { collectTweet, subscribeTweetUser } from "~services/tweet"
import {
  BackgroundMessageType,
  ContentMessageType,
  type BackgroundMessagePayload
} from "~types/message"

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

const showToastInWebPage = (message: ToastProps) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: ContentMessageType.INPAGE_TOAST,
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
chrome.runtime.onMessage.addListener(
  async (message: BackgroundMessagePayload, sender, sendResponse) => {
    switch (message.type) {
      case BackgroundMessageType.SAVE_TWEET:
        const tweetId = message.tweetId
        try {
          console.log("use this tweetId", tweetId)
          if (tweetId) {
            const res = await collectTweet({ tweetId })
            showToastInWebPage({
              message: `Save tweet ${tweetId} success`
            })
            chrome.runtime.sendMessage({
              type: ContentMessageType.ADD_COLLECTION,
              data: res
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
      case BackgroundMessageType.SUBSCRIBE_USER:
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
      case BackgroundMessageType.TOGGLE_PANEL:
        if (isSidePanelOpen) {
          // tell side bar to close itself
          chrome.runtime.sendMessage({
            type: ContentMessageType.SIDE_PANEL_CLOSE_ITSELF
          })
        } else {
          await chrome.sidePanel.open({ tabId: sender.tab.id })
        }
        isSidePanelOpen = !isSidePanelOpen
        break
      default:
        break
    }
  }
)

chrome.cookies.onChanged.addListener((changeInfo) => {
  if (
    changeInfo.cookie.domain.includes(process.env.PLASMO_PUBLIC_COOKIE_SERVER)
  ) {
    chrome.runtime.sendMessage({
      type: ContentMessageType.CHECK_AUTH
    })
  }
})
