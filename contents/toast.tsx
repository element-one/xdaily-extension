import cssText from "data-text:~/styles/global.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"

import { MessageType, type InpageToastPayload } from "~types/message"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export interface ToastProps {
  message: string
  type?: "success" | "error"
  duration?: number
}

const Toast: React.FC<ToastProps> = ({
  type = "success",
  message,
  duration = 3000
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const bgColor = type === "success" ? "bg-green" : "bg-red"

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  return (
    <div
      className={`font-geist px-4 py-2 shadow-lg rounded-lg z-50 ${bgColor} text-white transition-all transform opacity-100 animate-slideIn`}>
      {message}
    </div>
  )
}
const MAX_COUNT = 3 as const
const ToastContainer = () => {
  const [messages, setMessages] = useState<ToastProps[]>([])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((info: InpageToastPayload) => {
      if (info.type === MessageType.INPAGE_TOAST) {
        const message = info.message as ToastProps
        setMessages((prevMessages) => {
          if (prevMessages.length >= MAX_COUNT) {
            return [
              ...prevMessages.slice(1),
              { message: message.message, type: message.type || "success" }
            ]
          }
          return [
            ...prevMessages,
            { message: message.message, type: message.type || "success" }
          ]
        })
      }
    })
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      // remove the first message after 3000 ms
      const timer = setTimeout(() => {
        setMessages((prevMessages) => prevMessages.slice(1))
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [messages])

  return (
    <div className="fixed top-5 right-5 flex flex-col gap-y-2">
      {messages.map((message, index) => (
        <Toast
          key={index}
          message={message.message}
          type={message.type}
          duration={3000}
        />
      ))}
    </div>
  )
}

export default ToastContainer
