import type { PlasmoMessaging } from "@plasmohq/messaging"

import { showToastInWebPage } from "~background/utils"
import { chatWithUser } from "~services/chat"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const userId = req.body.userId
  const message = req.body.message
  try {
    if (userId && message) {
      const chatRes = await chatWithUser({ message, id: userId })
      res.send(chatRes)
    }
  } catch (e) {
    console.log(e)
    showToastInWebPage({
      message: "Something wrong",
      type: "error"
    })
    res.send(null)
  }
}

export default handler
