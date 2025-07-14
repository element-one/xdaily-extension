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
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs
      .sendMessage(tabs[0].id, { type: MessageType.START_SCREENSHOT })
      .finally(() => {
        res.send({ relayed: true })
      })
  })
}

export default handler
