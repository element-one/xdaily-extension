import clsx from "clsx"
import { useEffect, useMemo, useRef, useState } from "react"

import { useStore } from "~store/store"
import { ChatStatus } from "~types/enum"

export const ChatWindow = ({ screenName }: { screenName: string }) => {
  const {
    conversations,
    sendGreeting,
    setCurrentScreenName,
    currentScreenName,
    sendMessage,
    status
  } = useStore()
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentConversation =
    conversations.find((c) => c.screenName === currentScreenName)?.messages ??
    []

  useEffect(() => {
    setCurrentScreenName(screenName)
    const hasHistory = conversations.some((c) => c.screenName === screenName)
    if (!hasHistory) {
      sendGreeting(screenName)
    }
  }, [screenName])

  //   scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation])

  const isDisable = useMemo(() => {
    return !currentScreenName || !inputText.trim()
  }, [currentScreenName, inputText, status])

  const handleSend = async () => {
    if (isDisable) return
    const text = inputText.trim()
    setInputText("")
    await sendMessage(currentScreenName, text)
  }

  return (
    <div className="flex gap-y-4 rounded-md flex-col h-full bg-gray-50">
      <div className="bg-white py-2 text-base font-semibold">{screenName}</div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 space-y-4 stylized-scroll">
        {currentConversation.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? "bg-primary-brand text-white"
                  : "bg-gray-200 text-gray-800"
              }`}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* input and send message button */}
      <div className="bg-white py-2 ">
        <div className="flex rounded-md overflow-hidden border border-primary-brand]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-brand"
          />
          <button
            onClick={handleSend}
            className={clsx(
              "bg-primary-brand text-white  px-4 py-2 hover:bg-primary-brand focus:outline-none focus:ring-2 focus:ring-primary-brand",
              isDisable && "opacity-70 cursor-not-allowed"
            )}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
