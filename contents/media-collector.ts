import type { PlasmoCSConfig } from "plasmo"

import { onRouteChange } from "~libs/inject-tools/route"
import { MessageType, type MessagePayload } from "~types/message"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_idle",
  all_frames: true
}

let isCollecting = false
let stopRouteWatcher: (() => void) | null = null
let mutationObserver: MutationObserver | null = null
const collectedSrcSet = new Set<string>()

const getImageSources = () => {
  return Array.from(document.querySelectorAll("img"))
    .map((img) => img.getAttribute("src") || img.getAttribute("data-src"))
    .filter((src): src is string => !!src && !collectedSrcSet.has(src))
}

const getVideoSources = () => {
  return Array.from(document.querySelectorAll("video"))
    .map((video) => video.currentSrc || video.src)
    .filter((src): src is string => !!src && !collectedSrcSet.has(src))
}

const collectMedia = () => {
  const imgs = getImageSources()
  const videos = getVideoSources()

  imgs.forEach((src) => collectedSrcSet.add(src))
  videos.forEach((src) => collectedSrcSet.add(src))
  return { imgs, videos }
}

const sendCollectedMedia = (media: { imgs: string[]; videos: string[] }) => {
  console.log("media", media)
}

const observeMediaChanges = () => {
  if (mutationObserver) {
    mutationObserver.disconnect()
  }

  mutationObserver = new MutationObserver(() => {
    if (!isCollecting) return
    const media = collectMedia()
    if (media.imgs.length > 0 || media.videos.length > 0) {
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

  const initialMedia = collectMedia()
  if (initialMedia.imgs.length > 0 || initialMedia.videos.length > 0) {
    sendCollectedMedia(initialMedia)
  }

  observeMediaChanges()

  stopRouteWatcher = onRouteChange(() => {
    collectedSrcSet.clear()
    const media = collectMedia()
    if (media.imgs.length > 0 || media.videos.length > 0) {
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
