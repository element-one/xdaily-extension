import type { PlasmoMessaging } from "@plasmohq/messaging"

import { waitUntilDashboardReady } from "~background/utils"
import { MessageType } from "~types/message"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = req.body.data
  const reset = req.body.reset || false
  try {
    if (data) {
      await waitUntilDashboardReady(async () => {
        await chrome.runtime.sendMessage({
          type: MessageType.ADD_COLLECTING_MEDIA,
          data,
          reset
        })
      })
    }
  } catch (e) {
    console.log(e)
  }
  res.send("complete")
}

export default handler
