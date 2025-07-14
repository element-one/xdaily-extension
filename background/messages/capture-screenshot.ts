import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
    if (chrome.runtime.lastError) {
      res.send({ error: chrome.runtime.lastError.message })
    } else {
      res.send({ dataUrl })
    }
  })
}

export default handler
