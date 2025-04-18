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

const handler: PlasmoMessaging.MessageHandler<{ open?: boolean }> = async (
  req,
  res
) => {
  const shouldOpen =
    typeof req.body?.open === "boolean" ? req.body.open : !isSidePanelOpen

  if (shouldOpen) {
    const tabId = req?.sender?.tab?.id
    await chrome.sidePanel.open({ tabId: tabId })
    isSidePanelOpen = true
  } else {
    chrome.runtime.sendMessage({
      type: MessageType.SIDE_PANEL_CLOSE_ITSELF
    })
    isSidePanelOpen = false
  }
  res.send("complete")
}

export default handler
