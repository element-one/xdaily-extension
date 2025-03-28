import type { ToastProps } from "~contents/toast"
import { MessageType } from "~types/message"

export const showToastInWebPage = (message: ToastProps) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: MessageType.INPAGE_TOAST,
        message: message
      })
    }
  })
}
