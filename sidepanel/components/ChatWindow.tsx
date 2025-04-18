import { useChat } from "@ai-sdk/react"
import clsx from "clsx"
import { XIcon } from "lucide-react"
import Markdown from "markdown-to-jsx"
import { useEffect, useMemo, useRef, type FC, type FormEvent } from "react"

import { formatRelativeTime } from "~libs/date"
import { useChatHistory } from "~services/chat"
import { useStore } from "~store/store"
import type { TweetData } from "~types/tweet"

interface ChatWindowProps {
  screenName: string
  // NOTE: currently only chat panel need this prop
  quoteTweet?: TweetData | null
}
export const ChatWindow: FC<ChatWindowProps> = ({ screenName, quoteTweet }) => {
  const { removeQuoteTweet } = useStore()
  const chatRef = useRef<HTMLDivElement>(null)
  const {
    data: history,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useChatHistory(screenName, 20)

  const isLoadingHistory = isFetching || isFetchingNextPage

  const { messages, input, handleSubmit, handleInputChange, status, append } =
    useChat({
      id: screenName, // as different session
      // TODO real api request
      api: `${process.env.PLASMO_PUBLIC_SERVER_URL}/users/chat/${screenName}`,
      streamProtocol: "text",
      fetch: async (url, options) => {
        const data = JSON.parse(options.body as string)
        const userMessage = data.messages.pop().content
        const tweetId = data.tweetId ?? ""

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include", // cookie
          body: JSON.stringify({
            message: userMessage,
            tweetId
          })
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
        role: chatMessage.isBot ? "assistant" : "user"
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

  const handleFormSubmit = (event: FormEvent) => {
    if (isDisable) {
      return
    }

    const currentTweetId = quoteTweet?.tweetId
    removeQuoteTweet() // in case repeatedly sent and make sure user can retry
    const moreBody = currentTweetId
      ? {
          body: {
            tweetId: currentTweetId
          }
        }
      : {}
    handleSubmit(event, {
      allowEmptySubmit: false,
      ...moreBody
    })
  }

  const handleCancelQuoteTweet = () => {
    removeQuoteTweet()
  }

  return (
    <div className="flex gap-y-4 rounded-md flex-col h-full bg-gray-50">
      <div className="bg-white py-2 text-base font-semibold">
        {screenName ? `@${screenName}` : "Bot"}
      </div>
      <div
        className="flex-1 min-h-0 overflow-y-auto px-4 space-y-4 stylized-scroll"
        ref={chatRef}
        onScroll={(e) => {
          if ((e.currentTarget.scrollTop ?? 0) === 0) {
            loadMoreHistory()
          }
        }}>
        {isLoadingHistory && !showGreeting && (
          <div className="w-full text-center text-muted-foreground">
            Loading history...
          </div>
        )}

        {allMessages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`prose prose-sm break-words wrap w-fit max-w-full px-4 py-2 rounded-lg message-item ${
                m.role === "user"
                  ? "bg-primary-brand text-white"
                  : "bg-gray-200 text-gray-800"
              }`}>
              <Markdown>{m.content}</Markdown>
            </div>
          </div>
        ))}

        {(status === "submitted" || status === "streaming") && (
          <div className="self-start bg-gray-200 text-gray-500 px-4 py-2 rounded-lg w-fit animate-pulse">
            Thinking...
          </div>
        )}
        {showGreeting && (
          <div className="text-primary-brand w-full h-full flex items-center justify-center text-lg">
            Hi, How can I help you?
          </div>
        )}
      </div>

      {/* input and send message button */}
      <div className="bg-white py-2 flex flex-col gap-1">
        {/* quote post info */}
        {quoteTweet && (
          <div className="bg-slate-100 p-2 rounded-md relative">
            <div className="flex flex-row gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
              <div className="font-semibold  truncate">
                {quoteTweet.displayName}
              </div>
              <div className="text-slate-400 truncate">
                @{quoteTweet.username}
              </div>
              <div className="text-slate-400">
                · {formatRelativeTime(quoteTweet.timestamp)}
              </div>
            </div>
            <div className="mt-1 line-clamp-3">{quoteTweet.tweetText}</div>
            <div
              onClick={handleCancelQuoteTweet}
              className="absolute right-0 -top-2 w-4 h-4 bg-white hover:bg-red-50 rounded-full flex items-center justify-center cursor-pointer">
              <XIcon className="w-4 h-4 text-red-800" />
            </div>
          </div>
        )}
        <form
          className="flex rounded-md overflow-hidden border border-primary-brand]"
          onSubmit={(event) => handleFormSubmit(event)}>
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
