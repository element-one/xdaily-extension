import {
  useChat,
  type UseChatHelpers,
  type Message as VercelMessage
} from "@ai-sdk/react"
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

type CustomMessage = VercelMessage & {
  data?: {
    tweet?: TweetData
  }
}

type CustomUseChat = Omit<UseChatHelpers, "messages"> & {
  messages: CustomMessage[]
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

  const { messages, input, handleInputChange, status, append, setInput } =
    useChat({
      id: screenName, // as different session
      // TODO real api request
      api: `${process.env.PLASMO_PUBLIC_SERVER_URL}/users/chat/${screenName}`,
      streamProtocol: "text",
      fetch: async (url, options) => {
        const data = JSON.parse(options.body as string)
        const msg = data.messages.pop()
        const userMessage = msg.content
        const tweetId = msg.data?.tweet?.tweetId

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
    }) as CustomUseChat

  const allMessages = useMemo(() => {
    const historyMessages = (history?.pages ? history.pages : []).map(
      (chatMessage) => {
        let data = undefined
        if (chatMessage.tweet) {
          data = {
            tweet: {
              tweetId: chatMessage.tweet.tweetId,
              avatarUrl: chatMessage.tweet.twitterUser?.avatar ?? "",
              displayName: chatMessage.tweet.twitterUser?.name ?? "",
              username: chatMessage.tweet.twitterUser?.screenName ?? "",
              tweetText: chatMessage.tweet.content,
              timestamp: chatMessage.tweet.timestamp
            }
          }
        }

        return {
          id: `${chatMessage.chatAt}`,
          content: chatMessage.message,
          createdAt: new Date(chatMessage.chatAt),
          role: chatMessage.isBot ? "assistant" : "user",
          data
        } as CustomMessage
      }
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

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (isDisable) return

    const inputText = input.trim()
    if (!inputText) return
    const data = quoteTweet ? { tweet: { ...quoteTweet } } : undefined

    removeQuoteTweet() // in case repeatedly send and make sure user can retry
    setInput("")

    await append({
      role: "user",
      content: inputText,
      data
    })
  }

  const handleCancelQuoteTweet = () => {
    removeQuoteTweet()
  }

  // const QuoteTweetTools = [
  //   {
  //     icon: <BookmarkIcon className="w-4 h-4" />,
  //     tooltip: "Save as Memo",
  //     magicWord: "Save as Memo"
  //   },
  //   {
  //     icon: <ScissorsIcon className="w-4 h-4" />,
  //     tooltip: "Cut to clipboard",
  //     magicWord: "Cut to clipboard"
  //   }
  // ]

  // const handleClickToolButton = async (magicWord: string) => {
  //   if (isDisable) return

  //   const data = quoteTweet ? { tweet: { ...quoteTweet } } : undefined

  //   removeQuoteTweet() // in case repeatedly send and make sure user can retry
  //   setInput("")

  //   await append({
  //     role: "user",
  //     content: magicWord,
  //     data
  //   })
  // }

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
          <div key={i} className={`flex flex-col gap-2`}>
            <div
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
            {m.data?.tweet && (
              <ChatTweetSection tweet={m.data.tweet} showClearButton={false} />
            )}
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
          <>
            <ChatTweetSection
              tweet={quoteTweet}
              showClearButton={true}
              handleClear={handleCancelQuoteTweet}
            />
            {/* <div className="flex gap-1 items-center">
              {QuoteTweetTools.map((tool) => (
                <Tooltip.Provider key={tool.magicWord}>
                  <Tooltip.Root delayDuration={200}>
                    <Tooltip.Trigger
                      className="cursor-pointer p-2 bg-white hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      onClick={() => handleClickToolButton(tool.magicWord)}>
                      {tool.icon}
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="rounded-md border border-thinborder bg-muted px-3 py-1.5 text-sm text-foreground shadow-md"
                        side="top">
                        {tool.tooltip}
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              ))}
            </div> */}
          </>
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

const ChatTweetSection: FC<{
  tweet: TweetData
  showClearButton: boolean
  handleClear?: () => void
}> = ({ tweet, showClearButton, handleClear }) => {
  const handleCancelQuoteTweet = () => {
    handleClear?.()
  }
  return (
    <div className="bg-slate-100 p-2 rounded-md relative">
      <div className="items-center flex flex-row gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
        <div className="w-5 h-5 rounded-full overflow-hidden bg-primary-brand">
          {tweet.avatarUrl && (
            <img src={tweet.avatarUrl} className="object-contain" />
          )}
        </div>
        <div className="font-semibold  truncate">{tweet.displayName}</div>
        <div className="text-slate-400 truncate">
          @{tweet.username ? tweet.username : "user"}
        </div>
        <div className="text-slate-400">
          · {formatRelativeTime(tweet.timestamp)}
        </div>
      </div>
      <div className="mt-1 line-clamp-3">{tweet.tweetText}</div>
      {showClearButton && (
        <div
          onClick={handleCancelQuoteTweet}
          className="absolute right-0 -top-2 w-4 h-4 bg-white hover:bg-red-50 rounded-full flex items-center justify-center cursor-pointer">
          <XIcon className="w-4 h-4 text-red-800" />
        </div>
      )}
    </div>
  )
}
