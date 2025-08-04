import type { ScanningMedia } from "~types/media"

const getTweetUrlFromEl = (el: Element): string => {
  const article = el.closest("article")
  if (!article) return ""

  const linkEl = article.querySelector('a[href*="/status/"]')
  const href = linkEl?.getAttribute("href")
  if (!href) return ""

  return new URL(href, location.origin).href
}

export const getMediaInfoFromEl = (el: Element): ScanningMedia | undefined => {
  const isImage = el.tagName.toLowerCase() === "img"
  const src = isImage
    ? el.getAttribute("src") || el.getAttribute("data-src")
    : (el as HTMLVideoElement).currentSrc || (el as HTMLVideoElement).src

  if (!src) return undefined

  if (isImage) {
    const container = el.closest("article")?.parentElement
    if (container?.querySelector("video")) {
      return undefined // is cover of a video
    }
    const tweetUrl = getTweetUrlFromEl(el)
    return {
      src,
      type: "img",
      tweetUrl
    }
  }
  // try to get cover for video
  const container = el.closest("div")
  const posterImg = container?.querySelector("img")
  const videoEl = el as HTMLVideoElement
  const posterAttr = videoEl.getAttribute("poster")

  const poster =
    posterAttr ||
    posterImg?.getAttribute("src") ||
    posterImg?.getAttribute("data-src") ||
    ""
  const tweetUrl = getTweetUrlFromEl(el)
  return {
    src,
    type: "video",
    tweetUrl,
    poster
  }
}
