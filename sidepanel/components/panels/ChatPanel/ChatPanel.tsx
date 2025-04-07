import clsx from "clsx"
import { useEffect, useMemo, useRef, useState } from "react"

import type { ChatMessage } from "~types/chat"
import { ChatStatus } from "~types/enum"

export const ChatPanel = () => {
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageListContRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>(ChatStatus.IDLE)

  const currentConversation = useMemo(() => {
    return [...messages]
  }, [messages])

  useEffect(() => {
    if (currentConversation.length === 0) {
      addMessage("Hello! How can I help you today?", true)
    }
    scrollToBottom()
  }, [currentConversation])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 10)
  }

  const isDisable = useMemo(() => {
    return !inputText.trim() || status === ChatStatus.STREAMING
  }, [inputText, status])

  const addMessage = (message: string, isBot: boolean) => {
    const newMessage: ChatMessage = {
      message,
      isBot,
      chatAt: Date.now()
    }

    setMessages((prev) => {
      return [...prev, newMessage]
    })
    scrollToBottom()
  }

  const sendMessage = async (text: string) => {
    // add user message
    addMessage(text, false)
    setStatus(ChatStatus.STREAMING)

    try {
      // TODO: mock robot message
      addMessage("What can I do for you?", true)
    } catch (error) {
      addMessage("An error occurred. Please try again", true)
      setStatus(ChatStatus.ERROR)
    } finally {
      setStatus(ChatStatus.IDLE)
    }
  }

  const handleSend = async () => {
    if (isDisable) return
    const text = inputText.trim()
    setInputText("")
    await sendMessage(text)
  }

  return (
    <div className="flex gap-y-4 rounded-md flex-col h-full bg-gray-50">
      <div className="bg-white py-2 text-base font-semibold">Bot</div>
      <div
        className="flex-1 min-h-0 overflow-y-auto px-4 space-y-4 stylized-scroll"
        ref={messageListContRef}>
        {currentConversation.map((message) => (
          <div
            key={message.chatAt}
            className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg message-item ${
                message.isBot
                  ? "bg-gray-200 text-gray-800"
                  : "bg-primary-brand text-white"
              }`}>
              {message.message}
            </div>
          </div>
        ))}
        {status === ChatStatus.STREAMING && (
          <div className="w-fit px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* input and send message button */}
      <div className="bg-white py-2 ">
        <div className="flex rounded-md overflow-hidden border border-primary-brand]">
          <input
            disabled={status === ChatStatus.STREAMING}
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
