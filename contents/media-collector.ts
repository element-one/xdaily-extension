import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import { onRouteChange } from "~libs/inject-tools/route"
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
    const isImage = el.tagName.toLowerCase() === "img"
    const src = isImage
      ? el.getAttribute("src") || el.getAttribute("data-src")
      : (el as HTMLVideoElement).currentSrc || (el as HTMLVideoElement).src

    // can not find src
    if (!src || collectedSrcSet.has(src)) continue
    collectedSrcSet.add(src)

    // to check if it is included in a tweet post
    // TODO more precisely
    const article = el.closest("article")
    if (!article) {
      results.push({
        src,
        type: isImage ? "img" : "video",
        tweetUrl: ""
      })
      continue
    }

    const linkEl = article.querySelector('a[href*="/status/"]')
    const href = linkEl?.getAttribute("href")
    if (!href) {
      results.push({
        src,
        type: isImage ? "img" : "video",
        tweetUrl: ""
      })
      continue
    }

    const tweetUrl = new URL(href, location.origin).href

    results.push({
      src,
      type: isImage ? "img" : "video",
      tweetUrl
    })
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
