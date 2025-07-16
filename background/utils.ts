import type { ToastProps } from "~contents/toast"
import { DASHBOARD_READY_KEY, MessageType } from "~types/message"

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

async function isDashboardReady(): Promise<boolean> {
  const res = await chrome.storage.local.get(DASHBOARD_READY_KEY)
  return res[DASHBOARD_READY_KEY] === true
}

export async function waitUntilDashboardReady(
  callback: () => Promise<void>,
  interval = 1000
): Promise<void> {
  const ready = await isDashboardReady()
  if (ready) {
    // [Background] Sidepanel is ready
    await callback()
  } else {
    // [Background] Sidepanel not ready yet, retrying
    setTimeout(() => {
      waitUntilDashboardReady(callback, interval)
    }, interval)
  }
}
