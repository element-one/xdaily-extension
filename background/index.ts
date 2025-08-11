import { DASHBOARD_READY_KEY, MessageType } from "~types/message"

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.cookies.onChanged.addListener((changeInfo) => {
  if (
    changeInfo.cookie.domain.endsWith(process.env.PLASMO_PUBLIC_COOKIE_SERVER)
  ) {
    chrome.runtime.sendMessage({
      type: MessageType.CHECK_AUTH
    })
  }
})

// deal with sidepanel disconnected/closed
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel") {
    port.onDisconnect.addListener(() => {
      // clearing ready flag
      chrome.storage.local.remove(DASHBOARD_READY_KEY)
      // stop collecting media from twitter
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs
              .sendMessage(tab.id, {
                type: MessageType.TOGGLE_COLLECT_MEDIA,
                enable: false
              })
              .catch(() => {})
          }
        })
      })
    })
  }
})

// listen to the tab changing
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.id && tab.url) {
      chrome.tabs.sendMessage(tab.id, { type: MessageType.TAB_CHANGE })
    }
  })
})
