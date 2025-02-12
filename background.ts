import { apiFetch } from "~axios/axios"

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

let isSidePanelOpen = false

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

// src/background.ts
chrome.action.onClicked.addListener(() => {
  isSidePanelOpen = !isSidePanelOpen
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))
})

chrome.runtime.onMessage.addListener(async (message, sender) => {
  console.log(message)
  switch (message.type) {
    case "save_tweet":
      const tweetId = message.tweetId
      try {
        // TODO mock api
        const response = await apiFetch("/posts", {
          method: "POST",
          body: JSON.stringify({ tweetId })
        })
        if (response) {
          showToastInWebPage("Tweet 已成功保存！")
        }
        // console.log("Server response:", response)
      } catch (e) {
        console.log(e)
      }
      break
    case "toggle_side_panel":
      if (isSidePanelOpen) {
        // tell side bar to close itself
        chrome.runtime.sendMessage({ type: "sidepanel_close_self" })
      } else {
        await chrome.sidePanel.open({ tabId: sender.tab.id })
      }
      isSidePanelOpen = !isSidePanelOpen
      break
    default:
      break
  }
})
