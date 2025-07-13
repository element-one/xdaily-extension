import clsx from "clsx"
import cssText from "data-text:~/styles/global.css"
import { BotIcon, LoaderCircleIcon } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useRef, useState, type FC } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { extractTweetDataFromTweet, getUserIdFromTweet } from "~libs/tweet"

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

interface TooltipProps {
  children: React.ReactNode
  content: string
  side?: "top" | "bottom" | "left" | "right"
  sideOffset?: number
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = "top",
  sideOffset = 16,
  className
}) => {
  const offsetStyle: Record<string, React.CSSProperties> = {
    top: {
      bottom: `100%`,
      marginBottom: sideOffset,
      left: "50%",
      transform: "translateX(-50%)"
    },
    bottom: {
      top: "100%",
      marginTop: sideOffset,
      left: "50%",
      transform: "translateX(-50%"
    },
    left: {
      right: "100%",
      marginRight: sideOffset,
      top: "50%",
      transform: "translateY(-50%"
    },

    right: {
      left: "100%",
      marginLeft: sideOffset,
      top: "50%",
      transform: "translateY(-50%"
    }
  }

  return (
    <div className={clsx("relative group", className)}>
      {children}
      <div
        className={clsx(
          "absolute z-50 whitespace-nowrap bg-fill-bg-light border border-fill-bg-input rounded-lg px-3 py-2.5 text-text-default-regular text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none"
        )}
        style={offsetStyle[side]}>
        {content}
      </div>
    </div>
  )
}

interface ToolbarButtonProps {
  onClick?: () => void
  isLoading: boolean
  icon: React.ReactNode
  tooltip: string
}
const ToolbarButton: FC<ToolbarButtonProps> = ({
  onClick,
  isLoading,
  icon,
  tooltip
}) => {
  const handleClick = () => {
    onClick?.()
  }
  return (
    <Tooltip content={tooltip} side="left" sideOffset={8}>
      <div
        onClick={handleClick}
        className={clsx(
          "font-geist flex justify-center items-center w-8 h-8 rounded cursor-pointer hover:bg-fill-bg-deep",
          isLoading ? "cursor-not-allowed" : "cursor-pointer"
        )}>
        {isLoading ? (
          <LoaderCircleIcon className="size-8 animate-spin text-primary-brand" />
        ) : (
          <>{icon}</>
        )}
      </div>
    </Tooltip>
  )
}

const Toolbar = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [tweet, setTweet] = useState<HTMLElement | null>(null)
  const isMouseInside = useRef(false)

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

  const handleChatWithUser = async () => {
    if (!tweet) return
    const info = extractTweetDataFromTweet(tweet)
    if (!info) return
    const userId = info.username
    const avatarUrl = info.avatarUrl
    const name = info.displayName
    // open panel
    sendToBackground({
      name: "toggle-panel",
      body: {
        open: true
      }
    })
    // wait for 500ms
    await new Promise((resolve) => setTimeout(resolve, 500))
    await sendToBackground({
      name: "relay-chat-with-user",
      body: {
        userId,
        avatarUrl,
        userName: name
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
      id="xdaily-toolbar"
      className={clsx(
        "fixed z-50  border border-fill-bg-grey bg-fill-bg-light rounded-lg shadow-md transition-all duration-300 flex flex-col items-center gap-1 p-1",
        isVisible && isChatVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95"
      )}
      onMouseEnter={handleToolbarEnter}
      onMouseLeave={handleToolbarLeave}
      style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: 9999 }}>
      <ToolbarButton
        tooltip="Chat"
        onClick={handleChatWithUser}
        isLoading={false}
        icon={<BotIcon className="size-6 text-orange" />}
      />
    </div>
  )
}

export default Toolbar
