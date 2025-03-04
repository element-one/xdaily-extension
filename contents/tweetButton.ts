import cssText from "data-text:~/styles/global.css"
import type { PlasmoCSConfig } from "plasmo"

import { MessageType } from "~types/enum"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

// twitter is SPA
const observeTweets = () => {
  const observer = new MutationObserver(() => {
    document.querySelectorAll("article").forEach((tweet) => {
      if (!tweet.querySelector(".collect-button")) {
        injectButton(tweet)
      }
    })
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

const injectButton = (tweet: Element) => {
  // collect tweet id
  const button = document.createElement("button")
  button.innerText = "⭐ 收藏"
  button.className =
    "collect-button px-2 py-1 bg-blue-500 text-white rounded text-sm"
  button.style.marginLeft = "8px"

  // subsribe tweet user
  const userButton = document.createElement("button")
  userButton.innerText = "⭐ 订阅"
  userButton.className =
    "collect-button px-2 py-1 bg-blue-500 text-white rounded text-sm"
  userButton.style.marginLeft = "8px"

  const tweetHeader = tweet.querySelector("div[role='group']")
  if (tweetHeader) {
    tweetHeader.appendChild(button)
    tweetHeader.appendChild(userButton)
  }

  button.addEventListener("click", () => collectTweet(tweet as HTMLElement))
  userButton.addEventListener("click", () =>
    subscribeUser(tweet as HTMLElement)
  )
}

const collectTweet = (tweet: HTMLElement) => {
  const linkElement = tweet.querySelector("a[href*='/status/']")
  const tweetId = linkElement
    ? linkElement.getAttribute("href")?.split("/status/")[1]
    : ""

  chrome.runtime.sendMessage({
    type: MessageType.SAVE_TWEET,
    tweetId
  })
}

const subscribeUser = (tweet: HTMLElement) => {
  const userElement = tweet.querySelector("a[href*='/']")
  const userId = userElement?.getAttribute("href")?.split("/")[1] ?? ""

  chrome.runtime.sendMessage({
    type: MessageType.SUBSCRIBE_USER,
    userId
  })
}

observeTweets()
