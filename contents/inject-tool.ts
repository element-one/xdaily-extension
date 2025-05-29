import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import { getTweetIdFromTweet } from "~libs/tweet"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const COLLECT_BUTTON_CONT = "xdaily-collect-button-cont"
const loadingTweets = new Set<string>()

const getCollectIcon = () => `
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.6665 4.66732C2.6665 2.82637 4.15889 1.33398 5.99984 1.33398H9.9998C11.8407 1.33398 13.3331 2.82637 13.3331 4.66732V12.6601C13.3331 14.3626 11.3416 15.2866 10.0416 14.1872L8.43033 12.8245C8.18181 12.6143 7.81786 12.6143 7.56934 12.8245L5.958 14.1872C4.65806 15.2866 2.6665 14.3626 2.6665 12.6601V4.66732ZM5.99984 2.66732C4.89527 2.66732 3.99984 3.56275 3.99984 4.66732V12.6601C3.99984 13.2276 4.66369 13.5356 5.097 13.1692L6.70834 11.8064C7.4539 11.1759 8.54578 11.1759 9.29133 11.8064L10.9026 13.1692C11.3359 13.5356 11.9998 13.2276 11.9998 12.6601V4.66732C11.9998 3.56275 11.1044 2.66732 9.9998 2.66732H5.99984Z" fill="#34C759"></path>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4.66602C8.36819 4.66602 8.66667 4.96449 8.66667 5.33268V5.99935H9.33333C9.70152 5.99935 10 6.29783 10 6.66602C10 7.03421 9.70152 7.33268 9.33333 7.33268H8.66667V7.99935C8.66667 8.36754 8.36819 8.66602 8 8.66602C7.63181 8.66602 7.33333 8.36754 7.33333 7.99935V7.33268H6.66667C6.29848 7.33268 6 7.03421 6 6.66602C6 6.29783 6.29848 5.99935 6.66667 5.99935H7.33333V5.33268C7.33333 4.96449 7.63181 4.66602 8 4.66602Z" fill="#34C759"></path>
    </svg>
`

const getSpinnerIcon = () => `
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <circle cx="12" cy="12" r="10" stroke="#FFE600" stroke-width="4" stroke-linecap="round" />
  </svg>
`

// twitter is SPA
const observeTweets = () => {
  const observer = new MutationObserver(() => {
    document.querySelectorAll("article").forEach((tweet) => {
      const hasCollectButton = tweet.querySelector(`.${COLLECT_BUTTON_CONT}`)
      const hasBookmark = tweet.querySelector('[data-testid="bookmark"]')
      if (!hasCollectButton && hasBookmark) {
        injectButton(tweet)
      }
    })
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

const injectButton = (tweet: Element) => {
  const cont = document.createElement("div")
  cont.className = COLLECT_BUTTON_CONT
  cont.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 0px 8px;
  `
  const button = document.createElement("div")
  button.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.5em;
      height: 1.5m;
      border-radius: 0.375rem; /* rounded */
      cursor: pointer;
      transition: background-color 0.3s ease;
  `
  button.innerHTML = getCollectIcon()
  button.title = "Collect Post"
  cont.appendChild(button)
  button.addEventListener("click", (e) => {
    e.stopPropagation()
    collectTweet(tweet as HTMLElement, button)
  })
  cont.addEventListener("mouseenter", () => {
    button.style.backgroundColor = "#e8ecee"
  })
  cont.addEventListener("mouseleave", () => {
    button.style.backgroundColor = "transparent"
  })

  const tweetActions = tweet.querySelector("div[role='group']")
  if (!tweetActions) return

  const bookmarkButton = tweetActions.querySelector(
    "button[data-testid='bookmark']"
  )
  if (bookmarkButton && bookmarkButton.parentElement) {
    bookmarkButton.parentElement.insertBefore(cont, bookmarkButton)
  } else {
    tweetActions.appendChild(cont)
  }
}

const collectTweet = async (tweet: HTMLElement, button: HTMLElement) => {
  await sendToBackground({
    name: "toggle-panel",
    body: {
      open: true
    }
  })
  if (!tweet) return
  const tweetId = getTweetIdFromTweet(tweet)

  if (!tweetId) {
    return
  }
  if (loadingTweets.has(tweetId)) return
  loadingTweets.add(tweetId)

  button.innerHTML = getSpinnerIcon()

  try {
    await sendToBackground({
      name: "save-tweet",
      body: { tweetId }
    })
  } catch (error) {
    console.error("Error saving tweet:", error)
  } finally {
    loadingTweets.delete(tweetId)
    button.innerHTML = getCollectIcon()
  }
}

observeTweets()
