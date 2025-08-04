import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import { onRouteChange } from "~libs/inject-tools/route"
import { getMediaInfoFromEl } from "~libs/media"
import type { ScanningMedia } from "~types/media"
import { MessageType, type MessagePayload } from "~types/message"

export const config: PlasmoCSConfig = {
  // TODO: temporarily only show in these two sites
  matches: ["https://twitter.com/*", "https://x.com/*"],
  run_at: "document_idle",
  all_frames: true
}

let isCollecting = false
let stopRouteWatcher: (() => void) | null = null
let mutationObserver: MutationObserver | null = null
const collectedSrcSet = new Set<string>()

const getMediaWithTweetUrl = () => {
  const results: ScanningMedia[] = []

  const mediaElements: (HTMLImageElement | HTMLVideoElement)[] = [
    ...Array.from(document.querySelectorAll("img")),
    ...Array.from(document.querySelectorAll("video"))
  ]

  for (const el of mediaElements) {
    const info = getMediaInfoFromEl(el)
    if (!info) continue
    if (collectedSrcSet.has(info.src)) continue
    results.push(info)
  }

  return results
}

const sendCollectedMedia = async (media: ScanningMedia[]) => {
  console.log("testing", media)
  try {
    await sendToBackground({
      name: "collect-media",
      body: {
        data: media
      }
    })
  } catch (e) {}
}

const observeMediaChanges = () => {
  if (mutationObserver) {
    mutationObserver.disconnect()
  }

  mutationObserver = new MutationObserver(() => {
    if (!isCollecting) return
    const media = getMediaWithTweetUrl()
    if (media.length > 0) {
      sendCollectedMedia(media)
    }
  })

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  })
}

const startMediaCollection = () => {
  if (isCollecting) return

  isCollecting = true
  collectedSrcSet.clear()

  const initialMedia = getMediaWithTweetUrl()
  if (initialMedia.length > 0) {
    sendCollectedMedia(initialMedia)
  }

  observeMediaChanges()

  stopRouteWatcher = onRouteChange(() => {
    collectedSrcSet.clear()
    const media = getMediaWithTweetUrl()
    if (media.length) {
      sendCollectedMedia(media)
    }
  })
}

const stopMediaCollection = () => {
  if (!isCollecting) return

  isCollecting = false
  mutationObserver?.disconnect()
  mutationObserver = null
  stopRouteWatcher?.()
  stopRouteWatcher = null
  collectedSrcSet.clear()
}

const initialize = () => {
  chrome.runtime.onMessage.addListener((message: MessagePayload) => {
    if (message.type === MessageType.TOGGLE_COLLECT_MEDIA) {
      if (message.enable) {
        startMediaCollection()
      } else {
        stopMediaCollection()
      }
    }
  })
}

initialize()
