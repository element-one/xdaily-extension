import type { ScanningMedia } from "~types/media"

export const getMediaInfoFromEl = (el: Element): ScanningMedia | undefined => {
  const isImage = el.tagName.toLowerCase() === "img"
  const src = isImage
    ? el.getAttribute("src") || el.getAttribute("data-src")
    : (el as HTMLVideoElement).currentSrc || (el as HTMLVideoElement).src
  const type = isImage ? "img" : "video"
  if (!src) return undefined

  const article = el.closest("article")
  if (!article) {
    // not included in tweet post
    return {
      src,
      type,
      tweetUrl: ""
    }
  }
  const linkEl = article.querySelector('a[href*="/status/"]')
  const href = linkEl?.getAttribute("href")
  if (!href) {
    return {
      src,
      type,
      tweetUrl: ""
    }
  }
  const tweetUrl = new URL(href, location.origin).href
  return {
    src,
    type,
    tweetUrl
  }
}
