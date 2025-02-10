import cssText from "data-text:~/styles/global.css"

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
  const button = document.createElement("button")
  button.innerText = "⭐ 收藏"
  button.className =
    "collect-button px-2 py-1 bg-blue-500 text-white rounded text-sm"
  button.style.marginLeft = "8px"

  const tweetHeader = tweet.querySelector("div[role='group']")
  if (tweetHeader) {
    tweetHeader.appendChild(button)
  }

  button.addEventListener("click", () => collectTweet(tweet))
}

const collectTweet = (tweet: Element) => {
  const content = tweet.innerText
  const linkElement = tweet.querySelector("a[href*='/status/']")
  const link = linkElement
    ? "https://x.com" + linkElement.getAttribute("href")
    : ""
  console.log(content, link)

  chrome.runtime.sendMessage({ type: "save_tweet", content, link })
}

observeTweets()
