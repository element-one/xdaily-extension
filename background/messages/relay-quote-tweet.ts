import type { PlasmoMessaging } from "@plasmohq/messaging"

import { MessageType } from "~types/message"
import type { TweetData } from "~types/tweet"

type QuoteTweetMessage = {
  tweetInfo: TweetData
}

const handler: PlasmoMessaging.MessageHandler<QuoteTweetMessage> = async (
  req,
  res
) => {
  await chrome.runtime.sendMessage({
    type: MessageType.QUOTE_TWEET,
    data: req.body.tweetInfo
  })

  res.send({ relayed: true })
}

export default handler
