import { useChat } from "@ai-sdk/react"
import clsx from "clsx"
import { useEffect, useMemo, useRef } from "react"

export const ChatPanel = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageListContRef = useRef<HTMLDivElement>(null)
  const { messages, input, handleSubmit, handleInputChange, status } = useChat({
    // TODO
    // id: screenName, // as different session
    api: `${process.env.PLASMO_PUBLIC_SERVER_URL}/users/chat`,
    streamProtocol: "text",
    initialMessages: [
      {
        role: "assistant",
        content: "What can I do for you?",
        id: `${+new Date()}`
      }
    ],
    fetch: async (url, options) => {
      const userMessage = JSON.parse(options.body as string).messages.pop()
        .content

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // 携带 Cookie
        body: JSON.stringify({ message: userMessage })
      })
      return response
    }
  })

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 10)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const isDisable = useMemo(() => {
    return status !== "ready"
  }, [status])

  return (
    <div className="flex gap-y-4 rounded-md flex-col h-full bg-gray-50">
      <div className="bg-white py-2 text-base font-semibold">Bot</div>
      <div
        className="flex-1 min-h-0 overflow-y-auto px-4 space-y-4 stylized-scroll"
        ref={messageListContRef}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg message-item ${
                m.role === "user"
                  ? "bg-primary-brand text-white"
                  : "bg-gray-200 text-gray-800"
              }`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* input and send message button */}
      <div className="bg-white py-2 ">
        <form
          className="flex rounded-md overflow-hidden border border-primary-brand]"
          onSubmit={(event) => {
            if (isDisable) {
              return
            }
            handleSubmit(event, {
              allowEmptySubmit: false
            })
          }}>
          <input
            disabled={status !== "ready"}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-brand"
          />
          <button
            type="submit"
            className={clsx(
              "bg-primary-brand text-white  px-4 py-2 hover:bg-primary-brand focus:outline-none focus:ring-2 focus:ring-primary-brand",
              isDisable && "opacity-70 cursor-not-allowed"
            )}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
