import clsx from "clsx"
import cssText from "data-text:~/styles/global.css"
import { BookmarkIcon, BotIcon, LoaderCircleIcon, UserPlus } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useRef, useState, type FC } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { getTweetIdFromTweet, getUserIdFromTweet } from "~libs/tweet"
import { X_SITE } from "~types/enum"

export const config: PlasmoCSConfig = {
  // only show in these two sites
  matches: ["https://twitter.com/*", "https://x.com/*"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

interface ToolbarButtonProps {
  onClick?: () => void
  isLoading: boolean
  icon: React.ReactNode
}
const ToolbarButton: FC<ToolbarButtonProps> = ({
  onClick,
  isLoading,
  icon
}) => {
  const handleClick = () => {
    onClick?.()
  }
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "flex justify-center items-center gap-2 flex-col p-2 cursor-pointer hover:bg-slate-200 text-primary-brand",
        isLoading ? "cursor-not-allowed" : "cursor-pointer"
      )}>
      {isLoading ? (
        <LoaderCircleIcon className="size-6 animate-spin" />
      ) : (
        <>{icon}</>
      )}
    </div>
  )
}

const Toolbar = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [tweet, setTweet] = useState<HTMLElement | null>(null)
  const isMouseInside = useRef(false)

  const [isCollecting, setIsCollecting] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isChatVisible, setIsChatVisible] = useState(false)

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

  const handleCollectTweet = async () => {
    if (!tweet || isCollecting) return
    const tweetId = getTweetIdFromTweet(tweet)

    if (!tweetId) {
      return
    }

    setIsCollecting(true)
    try {
      await sendToBackground({
        name: "save-tweet",
        body: { tweetId }
      })
    } catch (error) {
      console.error("Error saving tweet:", error)
    } finally {
      setIsCollecting(false)
    }
  }

  const extractTweetIdFromUrl = (url: string): string => {
    const statusMatch = url.match(/\/status\/(\d+)/)
    if (statusMatch) return statusMatch[1]

    const mediaMatch = url.match(/\/status\/(\d+)\//)
    if (mediaMatch) return mediaMatch[1]

    return ""
  }

  const handleSubscribeUser = async () => {
    if (!tweet || isSubscribing) return
    const userId = getUserIdFromTweet(tweet)

    setIsSubscribing(true)
    const resp = await sendToBackground({
      name: "subscribe-user",
      body: {
        userId
      }
    })
    if (resp) {
      setIsSubscribing(false)
    }
  }

  const handleChatWithUser = async () => {
    if (!tweet) return
    const userId = getUserIdFromTweet(tweet)
    const userProfileUrl = `${X_SITE}/${userId}`
    if (window.location.href !== userProfileUrl) {
      window.location.href = `${X_SITE}/${userId}`
    }
    // open panel
    sendToBackground({
      name: "toggle-panel",
      body: {
        open: true
      }
    })
  }

  useEffect(() => {
    const checkIsKOL = async () => {
      if (!tweet) {
        setIsChatVisible(false)
        return
      }
      const userId = getUserIdFromTweet(tweet)
      const res = await sendToBackground({
        name: "is-user-kol",
        body: {
          userId
        }
      })
      console.log("testing", res)
      setIsChatVisible(res)
    }
    if (tweet) {
      checkIsKOL()
    }
  }, [tweet])

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
      <ToolbarButton
        onClick={handleCollectTweet}
        isLoading={isCollecting}
        icon={<BookmarkIcon className=" size-6" />}
      />
      <ToolbarButton
        onClick={handleSubscribeUser}
        isLoading={isSubscribing}
        icon={<UserPlus className="size-6" />}
      />
      {isChatVisible && (
        <ToolbarButton
          onClick={handleChatWithUser}
          isLoading={false}
          icon={<BotIcon className="size-6" />}
        />
      )}
    </div>
  )
}

export default Toolbar
