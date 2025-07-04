import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import {
  extractTweetDataFromTweet,
  findTweetButton,
  getTweetIdFromTweet
} from "~libs/tweet"
import { MessageType, type MessagePayload } from "~types/message"

import i18n from "../locales/i18n"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const COLLECT_BUTTON_CONT = "xdaily-collect-button-cont"
const QUOTE_BUTTON_CONT = "xdaily-quote-button-cont"

const loadingTweets = new Set<string>()

// twitter is SPA
const observeTweets = () => {
  const observer = new MutationObserver(() => {
    document.querySelectorAll("article").forEach((tweet) => {
      injectButton(tweet)
    })
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

const createCollectButton = (tweet: HTMLElement) => {
  const host = document.createElement("xdaily-collect-button")
  host.className = COLLECT_BUTTON_CONT
  const shadow = host.attachShadow({ mode: "open" })
  const collectLabel = i18n.t("content_inject_tool.collect_tooltip")
  const icon = `
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.6665 4.66732C2.6665 2.82637 4.15889 1.33398 5.99984 1.33398H9.9998C11.8407 1.33398 13.3331 2.82637 13.3331 4.66732V12.6601C13.3331 14.3626 11.3416 15.2866 10.0416 14.1872L8.43033 12.8245C8.18181 12.6143 7.81786 12.6143 7.56934 12.8245L5.958 14.1872C4.65806 15.2866 2.6665 14.3626 2.6665 12.6601V4.66732ZM5.99984 2.66732C4.89527 2.66732 3.99984 3.56275 3.99984 4.66732V12.6601C3.99984 13.2276 4.66369 13.5356 5.097 13.1692L6.70834 11.8064C7.4539 11.1759 8.54578 11.1759 9.29133 11.8064L10.9026 13.1692C11.3359 13.5356 11.9998 13.2276 11.9998 12.6601V4.66732C11.9998 3.56275 11.1044 2.66732 9.9998 2.66732H5.99984Z" fill="#34C759"></path>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4.66602C8.36819 4.66602 8.66667 4.96449 8.66667 5.33268V5.99935H9.33333C9.70152 5.99935 10 6.29783 10 6.66602C10 7.03421 9.70152 7.33268 9.33333 7.33268H8.66667V7.99935C8.66667 8.36754 8.36819 8.66602 8 8.66602C7.63181 8.66602 7.33333 8.36754 7.33333 7.99935V7.33268H6.66667C6.29848 7.33268 6 7.03421 6 6.66602C6 6.29783 6.29848 5.99935 6.66667 5.99935H7.33333V5.33268C7.33333 4.96449 7.63181 4.66602 8 4.66602Z" fill="#34C759"></path>
    </svg>
`

  const spinnerIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  `

  shadow.innerHTML = `
    <style>
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin: 0px 8px;
      }
      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.5em;
        height: 1.5em;
        border-radius: 0.375rem;
        cursor: pointer;
        position: relative;
      }
      .tooltip {
        position: absolute;
        bottom: 100%;
        margin-bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #151717;
        border: 1px solid #FFFFFF1A;
        border-radius: 0.5rem;
        padding: 10px 8px;
        font-size: 12px;
        color: white;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        z-index: 9999;
      }
      .button:hover .tooltip {
        opacity: 1;
      }
      .button > .icon,
      .button > .spinner-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        transition: opacity 0.3s ease;
        opacity: 1;
      }
      .button:hover .icon {
        opacity: 0.8;
      }
      .spinner-icon {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
    <div class="button">
      <div class="icon">${icon}</div>
      <div class="spinner-icon" style="display: none;">${spinnerIcon}</div>
      <div class="tooltip">${collectLabel}</div>
    </div>
  `

  const button = shadow.querySelector(".button")! as HTMLDivElement
  const iconEl = shadow.querySelector(".icon") as HTMLDivElement
  const spinnerEl = shadow.querySelector(".spinner-icon") as HTMLDivElement
  button.addEventListener("click", async (e) => {
    e.stopPropagation()
    if (!tweet) return
    const tweetId = getTweetIdFromTweet(tweet)

    if (!tweetId) {
      return
    }
    await sendToBackground({
      name: "toggle-panel",
      body: {
        open: true
      }
    })
    if (loadingTweets.has(tweetId)) return
    loadingTweets.add(tweetId)
    iconEl.style.display = "none"
    spinnerEl.style.display = "block"
    try {
      await sendToBackground({
        name: "save-tweet",
        body: { tweetId }
      })
    } catch (error) {
      console.error("Error saving tweet:", error)
    } finally {
      loadingTweets.delete(tweetId)
      iconEl.style.display = "block"
      spinnerEl.style.display = "none"
    }
  })

  return host
}

const createQuoteButton = (tweet: HTMLElement) => {
  const quoteLabel = i18n.t("content_inject_tool.quote_tooltip")
  const host = document.createElement("xdaily-quote-button")
  host.className = QUOTE_BUTTON_CONT
  const shadow = host.attachShadow({ mode: "open" })
  shadow.innerHTML = `
    <style>
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin: 0px 8px;
      }
      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2em;
        height: 2em;
        border-radius: 0.375rem;
        cursor: pointer;
        position: relative;
        opacity: 1;
        color: #FF3B30;
      }
      .tooltip {
        position: absolute;
        top: 100%;
        margin-top: 4px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #151717;
        border: 1px solid #FFFFFF1A;
        border-radius: 0.5rem;
        padding: 10px 8px;
        font-size: 12px;
        color: white;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        z-index: 9999;
      }

      .button:hover .tooltip {
        opacity: 1;
      }
      .button > .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        transition: opacity 0.3s ease;
      }
     .button:hover > .icon {
        opacity: 0.8;
      }
      
    </style>
    <div class="button">
      <svg
          class='icon'
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.3926 8.02504C15.0926 8.00052 14.7044 8.00001 14.1333 8.00001H13.3333C12.9651 8.00001 12.6667 7.70153 12.6667 7.33334C12.6667 6.96515 12.9651 6.66667 13.3333 6.66667L14.1609 6.66667C14.6975 6.66666 15.1404 6.66666 15.5012 6.69613C15.8759 6.72675 16.2204 6.79246 16.544 6.95732C17.0457 7.21298 17.4537 7.62093 17.7093 8.1227C17.8742 8.44625 17.9399 8.79072 17.9705 9.16545C18 9.52625 18 9.96915 18 10.5058V12.8272C18 13.3638 18 13.8067 17.9705 14.1675C17.9399 14.5422 17.8742 14.8867 17.7093 15.2103C17.4537 15.712 17.0457 16.12 16.544 16.3756C16.2204 16.5405 15.8759 16.6062 15.5012 16.6368C15.1404 16.6663 14.6975 16.6663 14.1608 16.6663H14.0209L12.5062 18.4338C12.3795 18.5816 12.1946 18.6667 12 18.6667C11.8054 18.6667 11.6204 18.5816 11.4938 18.4338L9.97905 16.6663H9.64362C9.19718 16.6663 8.82867 16.6663 8.52699 16.6457C8.21419 16.6244 7.92485 16.5787 7.64635 16.4634C6.9928 16.1927 6.47356 15.6735 6.2029 15.0199C6.08757 14.7414 6.0419 14.4521 6.02056 14.1393C5.99998 13.8376 5.99998 13.4691 5.99999 13.0227L5.99999 12.9998C5.99999 12.6316 6.29847 12.3332 6.66666 12.3332C7.03485 12.3332 7.33332 12.6316 7.33332 12.9998C7.33332 13.4748 7.33368 13.7976 7.3508 14.0486C7.36751 14.2935 7.39793 14.4208 7.43478 14.5098C7.57011 14.8366 7.82973 15.0962 8.1565 15.2315C8.24549 15.2684 8.37281 15.2988 8.61774 15.3155C8.86865 15.3326 9.1915 15.333 9.66647 15.333H10.2857C10.4804 15.333 10.6653 15.418 10.7919 15.5658L12 16.9755L13.2081 15.5658C13.3347 15.418 13.5196 15.333 13.7143 15.333H14.1333C14.7044 15.333 15.0926 15.3324 15.3926 15.3079C15.6849 15.284 15.8344 15.2408 15.9386 15.1876C16.1895 15.0598 16.3935 14.8558 16.5213 14.605C16.5745 14.5007 16.6177 14.3512 16.6416 14.0589C16.6661 13.7589 16.6667 13.3707 16.6667 12.7996V10.5333C16.6667 9.96229 16.6661 9.57409 16.6416 9.27403C16.6177 8.98175 16.5745 8.83228 16.5213 8.72802C16.3935 8.47714 16.1895 8.27316 15.9386 8.14533C15.8344 8.0922 15.6849 8.04892 15.3926 8.02504Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.66667 4C7.95362 4 8.20838 4.18362 8.29912 4.45585L8.94371 6.38962L10.8775 7.03421C11.1497 7.12495 11.3333 7.37971 11.3333 7.66667C11.3333 7.95362 11.1497 8.20838 10.8775 8.29912L8.94371 8.94371L8.29912 10.8775C8.20838 11.1497 7.95362 11.3333 7.66667 11.3333C7.37971 11.3333 7.12495 11.1497 7.03421 10.8775L6.38962 8.94371L4.45585 8.29912C4.18362 8.20838 4 7.95362 4 7.66667C4 7.37971 4.18362 7.12495 4.45585 7.03421L6.38962 6.38962L7.03421 4.45585C7.12495 4.18362 7.37971 4 7.66667 4ZM7.66667 6.77485L7.54912 7.12749C7.48277 7.32656 7.32656 7.48277 7.12749 7.54912L6.77485 7.66667L7.12749 7.78421C7.32656 7.85057 7.48277 8.00678 7.54912 8.20585L7.66667 8.55848L7.78421 8.20585C7.85057 8.00678 8.00678 7.85057 8.20585 7.78421L8.55848 7.66667L8.20585 7.54912C8.00678 7.48277 7.85057 7.32656 7.78421 7.12749L7.66667 6.77485Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 9.6C12.1722 9.6 12.325 9.71017 12.3795 9.87351L12.8162 11.1838L14.1265 11.6205C14.2898 11.675 14.4 11.8278 14.4 12C14.4 12.1722 14.2898 12.325 14.1265 12.3795L12.8162 12.8162L12.3795 14.1265C12.325 14.2898 12.1722 14.4 12 14.4C11.8278 14.4 11.675 14.2898 11.6205 14.1265L11.1838 12.8162L9.87351 12.3795C9.71017 12.325 9.6 12.1722 9.6 12C9.6 11.8278 9.71017 11.675 9.87351 11.6205L11.1838 11.1838L11.6205 9.87351C11.675 9.71017 11.8278 9.6 12 9.6Z"
            fill="currentColor"
          />
        </svg>
      <div class="tooltip">${quoteLabel}</div>
    </div>
  `

  const button = shadow.querySelector(".button")! as HTMLDivElement
  button.addEventListener("click", async (e) => {
    e.stopPropagation()
    if (!tweet) return
    const tweetInfo = extractTweetDataFromTweet(tweet)
    if (!tweetInfo) {
      return
    }
    sendToBackground({
      name: "toggle-panel",
      body: {
        open: true
      }
    })
    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: MessageType.QUOTE_TWEET,
        data: tweetInfo
      })
    }, 500)
  })

  return host
}

const injectButton = (tweet: Element) => {
  // inject collect tweet button
  const hasCollectButton = tweet.querySelector(`.${COLLECT_BUTTON_CONT}`)
  const bookmarkButton = findTweetButton("bookmark", tweet, false)
  if (!hasCollectButton && bookmarkButton) {
    const buttonEl = createCollectButton(tweet as HTMLElement)

    if (bookmarkButton?.parentElement) {
      bookmarkButton.parentElement.insertBefore(buttonEl, bookmarkButton)
    } else {
      const tweetActions = tweet.querySelector("div[role='group']")
      tweetActions.appendChild(buttonEl)
    }
  }

  // inject quote tweet button
  const hasQuoteButton = tweet.querySelector(`.${QUOTE_BUTTON_CONT}`)
  const moreButton = findTweetButton("caret", tweet, false)
  if (!hasQuoteButton && moreButton) {
    const buttonEl = createQuoteButton(tweet as HTMLElement)
    if (moreButton?.parentElement) {
      moreButton.parentElement.insertBefore(buttonEl, moreButton)
    }
  }
}

const refreshInjectedButtons = () => {
  document.querySelectorAll(`.${COLLECT_BUTTON_CONT}`).forEach((host) => {
    if (host.shadowRoot) {
      const tooltip = host.shadowRoot.querySelector(".tooltip")
      if (tooltip) {
        tooltip.textContent = i18n.t("content_inject_tool.collect_tooltip")
      }
    }
  })

  document.querySelectorAll(`.${QUOTE_BUTTON_CONT}`).forEach((host) => {
    if (host.shadowRoot) {
      const tooltip = host.shadowRoot.querySelector(".tooltip")
      if (tooltip) {
        tooltip.textContent = i18n.t("content_inject_tool.quote_tooltip")
      }
    }
  })
}

chrome.runtime.onMessage.addListener((message: MessagePayload) => {
  if (message.type === MessageType.LANGUAGE_CHANGED) {
    const newLang = message.language
    console.log("[content-script] Received language change:", newLang)

    i18n.changeLanguage(newLang).then(() => {
      refreshInjectedButtons()
    })
  }
})

observeTweets()
