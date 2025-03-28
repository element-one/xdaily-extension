import { MessageType } from "~types/message"

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.cookies.onChanged.addListener((changeInfo) => {
  if (
    changeInfo.cookie.domain.includes(process.env.PLASMO_PUBLIC_COOKIE_SERVER)
  ) {
    chrome.runtime.sendMessage({
      type: MessageType.CHECK_AUTH
    })
  }
})
