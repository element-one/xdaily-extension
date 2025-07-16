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

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel") {
    port.onDisconnect.addListener(() => {
      //[background] sidepanel disconnected, clearing ready flag
      chrome.storage.local.remove(DASHBOARD_READY_KEY)
    })
  }
})
