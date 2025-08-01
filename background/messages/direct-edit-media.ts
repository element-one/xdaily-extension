import type { PlasmoMessaging } from "@plasmohq/messaging"

import { waitUntilDashboardReady } from "~background/utils"
import { MessageType } from "~types/message"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = req.body.data
  try {
    if (data) {
      await waitUntilDashboardReady(async () => {
        await chrome.runtime.sendMessage({
          type: MessageType.DIRECT_EDIT_MEDIA,
          data
        })
      })
    }
  } catch (e) {
    console.log(e)
  }
  res.send("complete")
}

export default handler
