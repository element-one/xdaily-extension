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

const getMediaWithTweetUrl = (el?: (HTMLImageElement | HTMLVideoElement)[]) => {
  const results: ScanningMedia[] = []

  const mediaElements: (HTMLImageElement | HTMLVideoElement)[] = el ?? [
    ...Array.from(document.querySelectorAll("img")),
    ...Array.from(document.querySelectorAll("video"))
  ]

  for (const el of mediaElements) {
    const info = getMediaInfoFromEl(el)
    if (!info) continue
    if (collectedSrcSet.has(info.src)) continue
    collectedSrcSet.add(info.src)
    results.push(info)
  }

  return results
}

const sendCollectedMedia = async (media: ScanningMedia[]) => {
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

  mutationObserver = new MutationObserver((mutations) => {
    if (!isCollecting) return

    const newElements = []
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue

        if (node.tagName === "IMG" || node.tagName === "VIDEO") {
          newElements.push(node)
        }

        // find subtree
        newElements.push(...Array.from(node.querySelectorAll("img, video")))
      }
    }

    const media = getMediaWithTweetUrl(newElements)
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
      console.log("testing", message.enable)
      if (message.enable) {
        startMediaCollection()
      } else {
        stopMediaCollection()
      }
    }
  })
}

initialize()
