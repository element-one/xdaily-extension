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
