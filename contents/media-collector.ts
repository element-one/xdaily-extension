import type { PlasmoCSConfig } from "plasmo"

import { onRouteChange } from "~libs/inject-tools/route"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_idle",
  all_frames: true
}

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
  const observer = new MutationObserver(() => {
    const media = collectMedia()
    if (media.imgs.length > 0 || media.videos.length > 0) {
      sendCollectedMedia(media)
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

const startMediaCollection = () => {
  collectedSrcSet.clear()
  const initialMedia = collectMedia()
  if (initialMedia.imgs.length > 0 || initialMedia.videos.length > 0) {
    sendCollectedMedia(initialMedia)
  }

  observeMediaChanges()
}

window.addEventListener("load", () => {
  startMediaCollection()

  onRouteChange(() => {
    startMediaCollection()
  })
})
