import type { PlasmoMessaging } from "@plasmohq/messaging"

import { waitUntilDashboardReady } from "~background/utils"
import { MessageType } from "~types/message"

type ChatWithUserMessage = {
  userId: string
  avatarUrl?: string
  userName?: string
}

const handler: PlasmoMessaging.MessageHandler<ChatWithUserMessage> = async (
  req,
  res
) => {
  await waitUntilDashboardReady(async () => {
    await chrome.runtime.sendMessage({
      type: MessageType.CHAT_WITH_USER,
      data: {
        kolScreenName: req.body.userId,
        kolAvatarUrl: req.body.avatarUrl,
        kolUserName: req.body.userName
      }
    })
  })

  res.send({ relayed: true })
}

export default handler
