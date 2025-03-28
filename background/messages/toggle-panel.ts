import type { PlasmoMessaging } from "@plasmohq/messaging"

import { MessageType } from "~types/message"

// control side panel open state
let isSidePanelOpen = false

chrome.action.onClicked.addListener(() => {
  isSidePanelOpen = !isSidePanelOpen
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))
})

const handler: PlasmoMessaging.MessageHandler = async (req) => {
  if (isSidePanelOpen) {
    // tell side bar to close itself
    chrome.runtime.sendMessage({
      type: MessageType.SIDE_PANEL_CLOSE_ITSELF
    })
  } else {
    const tabId = req?.sender?.tab?.id
    await chrome.sidePanel.open({ tabId: tabId })
  }
  isSidePanelOpen = !isSidePanelOpen
}

export default handler
