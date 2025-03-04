import { collectTweet, subscribeTweetUser } from "~services/tweet"
import { MessageType } from "~types/enum"

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

const showToastInWebPage = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "toast",
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
        showToastInWebPage(`get tweetId ${tweetId} success`)
        if (tweetId) {
          const res = await collectTweet({ tweetId })
          console.log("testing", res)
        }
      } catch (e) {
        console.log(e)
      }
      break
    case MessageType.SUBSCRIBE_USER:
      const userId = message.userId
      try {
        if (userId) {
          const res = await subscribeTweetUser({ tweetUserId: userId })
          console.log("testing", res)
        }
      } catch (e) {
        console.log(e)
      }
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
