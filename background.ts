console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

let isSidePanelOpen = false

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
      chrome.storage.local.get("tweets", (data) => {
        const tweets = data.tweets || []
        tweets.push({ content: message.content, link: message.link })
        chrome.storage.local.set({ tweets })
      })
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
