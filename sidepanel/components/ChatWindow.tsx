import { useChat } from "@ai-sdk/react"
import clsx from "clsx"
import Markdown from "markdown-to-jsx"
import { useEffect, useMemo, useRef, type FC } from "react"

import { useChatHistory } from "~services/chat"

interface ChatWindowProps {
  screenName: string
}
export const ChatWindow: FC<ChatWindowProps> = ({ screenName }) => {
  const chatRef = useRef<HTMLDivElement>(null)
  const {
    data: history,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useChatHistory(screenName, 20)

  const isLoadingHistory = isFetching || isFetchingNextPage

  const { messages, input, handleSubmit, handleInputChange, status } = useChat({
    id: screenName, // as different session
    // TODO real api request
    api: `${process.env.PLASMO_PUBLIC_SERVER_URL}/users/chat/${screenName}`,
    streamProtocol: "text",
    fetch: async (url, options) => {
      const userMessage = JSON.parse(options.body as string).messages.pop()
        .content

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // cookie
        body: JSON.stringify({ message: userMessage })
      })
      return response
    }
  })

  const allMessages = useMemo(() => {
    const historyMessages = (history?.pages ? history.pages : []).map(
      (chatMessage) => ({
        id: chatMessage.chatAt,
        content: chatMessage.message,
        createdAt: new Date(chatMessage.chatAt),
        role: chatMessage.isBot ? "user" : "assistant"
      })
    )
    return [...historyMessages, ...messages]
  }, [messages, history])
  const showGreeting = allMessages.length === 0

  const scrollToBottom = () => {
    setTimeout(() => {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth"
      })
    }, 0)
  }

  // scroll to bottom when come new message
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // scroll to bottom after init history
  useEffect(() => {
    const initHistory = async () => {
      await fetchNextPage()
      scrollToBottom()
    }
    initHistory()
  }, [])

  const isDisable = useMemo(() => {
    return status !== "ready" || isLoadingHistory
  }, [status])

  const loadMoreHistory = async () => {
    if (isLoadingHistory || !hasNextPage) return
    await fetchNextPage()
  }

  return (
    <div className="flex gap-y-4 rounded-md flex-col h-full bg-gray-50">
      <div className="bg-white py-2 text-base font-semibold">
        {screenName ? screenName : "Bot"}
      </div>
      <div
        className="flex-1 min-h-0 overflow-y-auto px-4 space-y-4 stylized-scroll"
        ref={chatRef}
        onScroll={(e) => {
          if ((e.currentTarget.scrollTop ?? 0) === 0) {
            loadMoreHistory()
          }
        }}>
        {isLoadingHistory && <div>is loading history</div>}
        {allMessages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`prose prose-sm break-words max-w-xs lg:max-w-md px-4 py-2 rounded-lg message-item ${
                m.role === "user"
                  ? "bg-primary-brand text-white"
                  : "bg-gray-200 text-gray-800"
              }`}>
              <Markdown>{m.content}</Markdown>
            </div>
          </div>
        ))}
        {showGreeting && (
          <div className="text-primary-brand w-full h-full flex items-center justify-center text-lg">
            Hi, How can I help you?
          </div>
        )}
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
