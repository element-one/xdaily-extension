import type { PlasmoMessaging } from "@plasmohq/messaging"

import { MessageType } from "~types/message"

type ChatWithUserMessage = {
  userId: string
}

const handler: PlasmoMessaging.MessageHandler<ChatWithUserMessage> = async (
  req,
  res
) => {
  await chrome.runtime.sendMessage({
    type: MessageType.CHAT_WITH_USER,
    data: {
      kolScreenName: req.body.userId
    }
  })

  res.send({ relayed: true })
}

export default handler
