import type { PlasmoMessaging } from "@plasmohq/messaging"

import { showToastInWebPage } from "~background/utils"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const userId = req.body.userId
  try {
    console.log("use this tweetId", userId)
    if (userId) {
      showToastInWebPage({
        message: `Subscribe to @${userId} success`
      })
    }
  } catch (e) {
    console.log(e)
  }
}

export default handler
