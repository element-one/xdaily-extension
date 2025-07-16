import type { PlasmoMessaging } from "@plasmohq/messaging"

import { showToastInWebPage, waitUntilDashboardReady } from "~background/utils"
import { collectTweet } from "~services/tweet"
import { MessageType } from "~types/message"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const tweetId = req.body.tweetId
  try {
    console.log("use this tweetId", tweetId)
    if (tweetId) {
      const res = await collectTweet({ tweetId })
      showToastInWebPage({
        message: `Save tweet ${tweetId} success`
      })
      await waitUntilDashboardReady(async () => {
        await chrome.runtime.sendMessage({
          type: MessageType.ADD_COLLECTION,
          data: res
        })
      })
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
