import {
  useChat,
  type UseChatHelpers,
  type Message as VercelMessage
} from "@ai-sdk/react"
import clsx from "clsx"
import { ArrowUpIcon, ClockIcon, XIcon } from "lucide-react"
import Markdown from "markdown-to-jsx"
import { useEffect, useMemo, useRef, type FC, type FormEvent } from "react"

import { formatTweetDate } from "~libs/date"
import { useChatHistory } from "~services/chat"
import { useStore } from "~store/store"
import type { TweetData } from "~types/tweet"

import MemoIcon from "./icons/MemoIcon"
import ReminderIcon from "./icons/ReminderIcon"
import SheetIcon from "./icons/SheetIcon"
import { Avatar } from "./ui/Avatar"
import { EmptyContent } from "./ui/EmptyContent"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/Select"
import { Tooltip } from "./ui/Tooltip"

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

  const Tools = [
    {
      type: "memo",
      icon: <MemoIcon className="size-5" />,
      tooltip: "Save as Memo",
      magicWord: "Save as Memo"
    },
    {
      type: "sheet",
      icon: <SheetIcon className="size-5" />,
      tooltip: "Save as Sheet",
      magicWord: "Save as Sheet"
    },
    {
      type: "reminder",
      icon: <ReminderIcon className="size-5" />,
      tooltip: "Remind later",
      magicWord: "Remind me later"
    }
  ]

  const handleClickToolButton = async (magicWord: string) => {
    if (isDisable) return

    const data = quoteTweet ? { tweet: { ...quoteTweet } } : undefined

    removeQuoteTweet() // in case repeatedly send and make sure user can retry
    setInput("")

    await append({
      role: "user",
      content: magicWord,
      data
    })
  }

  return (
    <div className="flex gap-y-6 rounded-md flex-col h-full">
      <div className="text-xs font-semibold h-[18px] flex items-center text-primary-brand">
        {screenName ? `@${screenName}` : "Bot"}
      </div>
      <div
        className="flex-1 min-h-0 overflow-y-auto space-y-6 stylized-scroll"
        ref={chatRef}
        onScroll={(e) => {
          if ((e.currentTarget.scrollTop ?? 0) === 0) {
            loadMoreHistory()
          }
        }}>
        {isLoadingHistory && !showGreeting && (
          <div className="w-full text-center text-white">
            Loading history...
          </div>
        )}

        {allMessages.map((m, i) => (
          <div key={i} className={`flex flex-col gap-3`}>
            <div
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`prose prose-sm break-words wrap w-fit max-w-[92%] p-3 rounded-lg message-item font-light text-sm border border-fill-bg-input ${
                  m.role === "user"
                    ? "bg-primary-brand text-text-inverse-primary"
                    : "bg-fill-bg-light text-text-default-primary"
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
          <div className="self-start bg-fill-bg-light text-text-default-primary0 p-3 rounded-lg border border-fill-bg-input w-fit animate-pulse">
            Thinking...
          </div>
        )}
        {showGreeting && (
          <EmptyContent
            content="Hi, How can I help you?"
            hideImage={true}
            textClassName="text-primary-brand"
          />
        )}
      </div>

      {/* input and send message button */}
      <div className="py-2 flex flex-col gap-1">
        <div className="flex mb-2 items-center justify-between gap-10">
          <Select value="default">
            <SelectTrigger className="w-[176px]" size="sm">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="default" value="default">
                Default
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-4 items-center">
            {Tools.map((tool) => (
              <Tooltip key={tool.type} content={tool.tooltip}>
                <div
                  onClick={() => handleClickToolButton(tool.magicWord)}
                  className="text-fill-layer-layer hover:text-primary-brand cursor-pointer">
                  {tool.icon}
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
        <form
          className="p-3 flex flex-col items-end rounded-xl overflow-hidden border border-primary-brand bg-fill-bg-light"
          onSubmit={(event) => handleFormSubmit(event)}>
          {/* quote post info */}
          {quoteTweet && (
            <div className="w-full mb-2">
              <ChatTweetSection
                tweet={quoteTweet}
                showClearButton={true}
                handleClear={handleCancelQuoteTweet}
              />
            </div>
          )}
          <textarea
            disabled={status !== "ready"}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="mb-1 w-full pb-0 focus:outline-none focus:ring-0 bg-transparent min-h-[70px] h-[70px] overflow-y-auto resize-none"
          />
          <button
            type="submit"
            className={clsx(
              "border border-[#404040] w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:brightness-75 focus:outline-none focus:ring-0",
              isDisable && "opacity-70 cursor-not-allowed"
            )}>
            <ArrowUpIcon className="w-6 h-6 text-primary-brand" />
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
    <div className="bg-fill-bg-light rounded-xl relative border border-fill-bg-input p-3 w-full">
      <div className="items-center flex flex-row gap-2 justify-start">
        <Avatar
          url={tweet.avatarUrl}
          className="w-8 h-8"
          alt={tweet.displayName}
        />
        <div>
          <div className="text-sm text-text-default-primary truncate h-[18px] flex items-center">
            {tweet.displayName}
          </div>
          <div className="h-[18px] flex items-center text-primary-brand text-xs truncate">
            @{tweet.username ? tweet.username : "user"}
          </div>
        </div>
      </div>
      <div className="mt-2 line-clamp-2">{tweet.tweetText}</div>
      <div className="mt-2 text-text-default-secondary text-xs flex items-center h-[18px] gap-1">
        <ClockIcon className="w-[14px] h-[14px] text-orange" />
        <span>{formatTweetDate(tweet.timestamp)}</span>
      </div>
      {showClearButton && (
        <div
          onClick={handleCancelQuoteTweet}
          className="absolute top-3 right-3 w-4 h-4 bg-fill-bg-input hover:brightness-75 rounded-full flex items-center justify-center cursor-pointer">
          <XIcon className="w-3 h-3 text-text-default-secondary" />
        </div>
      )}
    </div>
  )
}
