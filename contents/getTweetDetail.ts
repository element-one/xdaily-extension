import { ContentMessageType } from "~types/message"
import type { TweetDetailPageData } from "~types/tweet"

const getTweetInfoFromURL = () => {
  const pathSegments = window.location.pathname.split("/")
  if (pathSegments.length >= 4 && pathSegments[2] === "status") {
    return {
      username: pathSegments[1],
      tweetId: pathSegments[3]
    }
  }
  return null
}

const getTweetContent = () => {
  return new Promise((resolve) => {
    const checkTweet = () => {
      const article = document.querySelector("article")
      if (article) {
        const tweetTextNode = article.querySelector("div[lang]") as HTMLElement
        const content = tweetTextNode ? tweetTextNode.innerText : null

        const profileImg = article.querySelector(
          'img[src*="profile_images"]'
        ) as HTMLImageElement
        const avatar = profileImg ? profileImg.src : null

        resolve({ content, avatar })
        return true
      }
      return false
    }

    if (checkTweet()) return

    const observer = new MutationObserver(() => {
      if (checkTweet()) {
        observer.disconnect()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
  })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === ContentMessageType.REQUEST_TWEET_DETAILS) {
    const tweetInfo = getTweetInfoFromURL()
    if (!tweetInfo) return sendResponse(null)

    getTweetContent().then(({ content, avatar }) => {
      const tweetData = {
        username: tweetInfo.username,
        tweetId: tweetInfo.tweetId,
        content,
        avatar,
        url: window.location.href
      } as TweetDetailPageData

      console.log("Tweet Data:", tweetData)

      sendResponse(tweetData)
    })

    return true
  }
})
