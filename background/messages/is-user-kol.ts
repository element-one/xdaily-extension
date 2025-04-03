import type { PlasmoMessaging } from "@plasmohq/messaging"

import { checkKolStatus } from "~services/chat"
import { KolStatus } from "~types/enum"

const handler: PlasmoMessaging.MessageHandler<{ userId: string }> = async (
  req,
  res
) => {
  const screenName = req.body.userId
  try {
    const response = await checkKolStatus(screenName)
    res.send(response.kolStatus === KolStatus.APPROVED)
  } catch (e) {
    res.send(false)
  }
}

export default handler
