import clsx from "clsx"
import cssText from "data-text:~/styles/global.css"
import { BotIcon } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useRef, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { getMediaInfoFromEl } from "~libs/media"

export const config: PlasmoCSConfig = {
  // TODO currently only show in these two sites
  matches: ["https://twitter.com/*", "https://x.com/*"],
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
  const [media, setMedia] = useState<Element | null>(null)
  const isMouseInside = useRef(false)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      document.querySelectorAll("img, video").forEach((media: HTMLElement) => {
        if ((media as HTMLElement).dataset.bound === "true") return
        media.dataset.bound = "true"
        let targetElement = media
        if (media.tagName.toLowerCase() === "video") {
          const container = media.closest('[data-testid="videoComponent"]')
          if (container) {
            targetElement = container as HTMLElement
          }
        }
        targetElement.addEventListener("mouseover", () => showToolbar(media))
        targetElement.addEventListener("mouseleave", hideToolbar)
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

  const showToolbar = (el: Element) => {
    setIsVisible(true)
    setMedia(el)
    const rect = el.getBoundingClientRect()
    setPosition({
      y: rect.top + 12,
      x: rect.left + 12
    })
  }

  const hideToolbar = (event: MouseEvent) => {
    const related = event.relatedTarget as HTMLElement
    if (related && related.closest("#toolbar")) {
      return
    }
    setIsVisible(false)
  }

  const handleCollectMedia = async () => {
    if (!media) return
    const info = getMediaInfoFromEl(media)
    if (!info) return
    // open panel
    sendToBackground({
      name: "toggle-panel",
      body: {
        open: true
      }
    })
    try {
      await sendToBackground({
        name: "direct-edit-media",
        body: {
          data: info
        }
      })
    } catch (e) {}
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
      id="xdaily-toolbar"
      className={clsx(
        "fixed z-50  border border-fill-bg-grey bg-fill-bg-light text-orange rounded-lg shadow-md transition-all duration-300 flex items-center gap-1 p-1 px-2 text-sm cursor-pointer",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
      onClick={handleCollectMedia}
      onMouseEnter={handleToolbarEnter}
      onMouseLeave={handleToolbarLeave}
      style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: 9999 }}>
      <BotIcon className="size-4 text-orange" /> Collect it
    </div>
  )
}

export default Toolbar
