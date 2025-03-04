import clsx from "clsx"
import cssText from "data-text:~/styles/global.css"
import { BookmarkIcon, UserPlus } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

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

const Toolbar = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [tweet, setTweet] = useState<HTMLElement | null>(null)
  const isMouseInside = useRef(false)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      document.querySelectorAll("article").forEach((tweet) => {
        if (!tweet.dataset.observed) {
          tweet.dataset.observed = "true"
          tweet.addEventListener("mouseover", (event) =>
            showToolbar(tweet, event)
          )
          tweet.addEventListener("mouseleave", hideToolbar)
        }
      })
    })

    const handleScroll = () => {
      if (isMouseInside.current) {
        setIsVisible(false)
      }
    }

    observer.observe(document.body, { childList: true, subtree: true })
    document.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      document.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const showToolbar = (tweet: HTMLElement, event: MouseEvent) => {
    setIsVisible(true)
    setTweet(tweet)
    const rect = tweet.getBoundingClientRect()
    setPosition({
      y: rect.top,
      x: rect.left + rect.width + 10
    })
  }

  const hideToolbar = (event: MouseEvent) => {
    const related = event.relatedTarget as HTMLElement
    if (related && related.closest("#toolbar")) {
      return
    }
    setIsVisible(false)
  }

  const handleSubscribeUser = () => {
    if (!tweet) return
    const userElement = tweet.querySelector("a[href*='/']")
    const userId = userElement?.getAttribute("href")?.split("/")[1] ?? ""

    chrome.runtime.sendMessage({
      type: MessageType.SUBSCRIBE_USER,
      userId
    })
  }

  const handleCollectTweet = () => {
    if (!tweet) return
    const linkElement = tweet.querySelector("a[href*='/status/']")
    const tweetId = linkElement
      ? linkElement.getAttribute("href")?.split("/status/")[1]
      : ""

    chrome.runtime.sendMessage({
      type: MessageType.SAVE_TWEET,
      tweetId
    })
  }

  const handleToolbarEnter = () => {
    isMouseInside.current = true
    setIsVisible(true)
  }
  const handleToolbarLeave = () => {
    isMouseInside.current = false
    setIsVisible(false)
  }

  return (
    <div
      id="mecoin-toolbar"
      className={clsx(
        "fixed z-50  border border-gray-300 bg-white text-xs text-black rounded-lg shadow-md overflow-hidden transition-all duration-300 flex flex-col items-center gap-1",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
      onMouseEnter={handleToolbarEnter}
      onMouseLeave={handleToolbarLeave}
      style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: 9999 }}>
      <div
        onClick={handleCollectTweet}
        className="flex justify-center items-center gap-2 flex-col p-2 cursor-pointer hover:bg-slate-200">
        <BookmarkIcon className="text-primary-brand size-6" />
      </div>
      <div
        onClick={handleSubscribeUser}
        className="flex justify-center items-center gap-2 flex-col p-2 cursor-pointer hover:bg-slate-200">
        <UserPlus className="text-primary-brand size-6" />
      </div>
    </div>
  )
}

export default Toolbar
