import type { TweetData } from "~types/tweet"

export const getUserIdFromTweet = (tweet: HTMLElement) => {
  try {
    if (!tweet) return ""
    const tweetCard = tweet.closest('[data-testid="tweet"]') || tweet

    const userNameElement = tweetCard.querySelector(
      [
        'a[href^="/"][href*="/status"]',
        'div[data-testid="User-Name"] a[href*="/"]:first-child',
        'a[href*="/"][role="link"][aria-hidden="false"]'
      ].join(",")
    ) as HTMLAnchorElement

    if (!userNameElement) {
      return ""
    }

    // from url
    const href = userNameElement.getAttribute("href")
    const userId = href?.split("/")?.filter(Boolean)[0] || ""

    if (!userId || userId === "i" || userId === "search") {
      console.warn("Invalid username extracted:", userId, href)
      return ""
    }

    return userId
  } catch (error) {
    console.error("Error extracting username:", error)
    return ""
  }
}

const extractTweetIdFromUrl = (url: string): string => {
  const statusMatch = url.match(/\/status\/(\d+)/)
  if (statusMatch) return statusMatch[1]

  const mediaMatch = url.match(/\/status\/(\d+)\//)
  if (mediaMatch) return mediaMatch[1]

  return ""
}
export const getTweetIdFromTweet = (tweet: HTMLElement) => {
  if (!tweet) return ""
  const tweetCard = tweet.closest('[data-testid="tweet"]') || tweet
  const linkElement = tweetCard.querySelector(
    'a[href*="/status/"][aria-label][href^="/"][href$="/photo/1"], ' + // exclude media
      'a[href*="/status/"]:not([href*="/retweets"]):not([href*="/likes"])' // exclude action link
  ) as HTMLAnchorElement

  const href = linkElement?.getAttribute("href") || ""
  const tweetId = extractTweetIdFromUrl(href)
  return tweetId || ""
}

export function extractTweetDataFromTweet(tweetElement: HTMLElement) {
  if (!tweetElement) return null
  const avatarImg = tweetElement.querySelector(
    '[data-testid="Tweet-User-Avatar"] img'
  ) as HTMLImageElement
  const displayName = tweetElement.querySelector(
    '[data-testid="User-Name"] > div > div > a > div > div span'
  )?.textContent
  const username = tweetElement
    .querySelector('[data-testid="User-Name"] > div > div > a')
    ?.getAttribute("href")
    ?.replace("/", "")
  const tweetText = Array.from(
    tweetElement.querySelectorAll('[data-testid="tweetText"]')
  )
    .map((node) => node.textContent)
    .join(" ")
  const timestamp = tweetElement.querySelector("time")?.getAttribute("datetime")

  const tweetId = getTweetIdFromTweet(tweetElement)

  return {
    tweetId,
    avatarUrl: avatarImg?.src,
    displayName,
    username,
    tweetText,
    timestamp
  } as TweetData
}

/**
 * get button from tweet section
 * @param tag to find inside data-testid
 * @param tweet article
 * @param returnParent or not
 * @returns HTMLElement | null
 */
export const findTweetButton = (
  tag: string,
  tweet: Element,
  returnParent: boolean = true
): HTMLElement | null => {
  const buttons = tweet.querySelectorAll("button[data-testid]")

  for (const btn of buttons) {
    const testId = btn.getAttribute("data-testid")
    if (testId && testId.toLowerCase().includes(tag)) {
      return returnParent
        ? (btn.parentElement as HTMLElement)
        : (btn as HTMLElement)
    }
  }

  return null
}

export const getUserInfoFromHeader = (header: Element) => {
  const headerCont = header.parentElement
  let avatar = ""
  const imgEl = headerCont.querySelector(
    '[data-testid^="UserAvatar-Container"] img'
  ) as HTMLImageElement
  if (imgEl?.src) {
    avatar = imgEl.src
  }

  const bgDiv = headerCont.querySelector(
    '[data-testid^="UserAvatar-Container"] [style*="background-image"]'
  ) as HTMLElement
  if (bgDiv) {
    const bgImage = bgDiv.style.backgroundImage
    const match = bgImage.match(/url\(["']?(.*?)["']?\)/)
    if (match?.[1]) {
      avatar = match[1]
    }
  }

  const spans = Array.from(header.querySelectorAll("span")).filter((span) => {
    return !span.querySelector("span")
  })

  let displayName = ""
  let screenName = ""

  for (const span of spans) {
    const text = span.textContent?.trim() ?? ""
    if (text.startsWith("@")) {
      screenName = text.slice(1)
    } else if (!displayName) {
      displayName = text
    }
  }
  return {
    displayName,
    screenName,
    avatar
  }
}
