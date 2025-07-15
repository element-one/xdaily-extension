import type { PlasmoMessaging } from "@plasmohq/messaging"

import { showToastInWebPage, waitUntilDashboardReady } from "~background/utils"
import { subscribeTweetUser } from "~services/tweet"
import { MessageType } from "~types/message"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const userId = req.body.userId
  try {
    console.log("use this tweetId", userId)
    if (userId) {
      const res = await subscribeTweetUser({ tweetUserId: userId })
      if (res) {
        showToastInWebPage({
          message: `Subscribe to @${userId} success`
        })

        await waitUntilDashboardReady(async () => {
          await chrome.runtime.sendMessage({
            type: MessageType.ADD_USER_COLLECTION,
            data: res
          })
        })
      }
    }
  } catch (e) {
    console.log(e)
    showToastInWebPage({
      message: "Something wrong",
      type: "error"
    })
  }
  res.send("complete")
}

export default handler
