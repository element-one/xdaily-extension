import {
  useChat,
  type UseChatHelpers,
  type Message as VercelMessage
} from "@ai-sdk/react"
import clsx from "clsx"
import { ArrowUpIcon, ClockIcon, XIcon } from "lucide-react"
import Markdown from "markdown-to-jsx"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type FormEvent
} from "react"
import robotImg from "url:/assets/robot.png" // strange

import { formatTweetDate } from "~libs/date"
import {
  useChatHistory,
  useGetChatModelInfo,
  useGetUserAgentModels
} from "~services/chat"
import { useStore } from "~store/store"
import type { TweetData } from "~types/tweet"

import MemoIcon from "../icons/MemoIcon"
import ReminderIcon from "../icons/ReminderIcon"
import SheetIcon from "../icons/SheetIcon"
import { Avatar } from "../ui/Avatar"
import { EmptyContent } from "../ui/EmptyContent"
import { ImageWithFallback } from "../ui/ImageWithFallback"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/Select"
import { Tooltip } from "../ui/Tooltip"

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
  const { removeQuoteTweet, userInfo } = useStore()
  const chatRef = useRef<HTMLDivElement>(null)
  const {
    data: history,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useChatHistory(screenName, 20)

  const isSelf = userInfo.username === screenName

  const { data: chatModelInfo } = useGetChatModelInfo(screenName)
  const { data: modelsResp } = useGetUserAgentModels(
    chatModelInfo?.agent?.id ?? ""
  )

  const [actModelId, setActModelId] = useState("")

  const models = useMemo(() => {
    if (!modelsResp) return []
    return modelsResp.data ?? []
  }, [modelsResp])

  useEffect(() => {
    if (chatModelInfo) {
      setActModelId(chatModelInfo.model.id ?? "")
    }
  }, [chatModelInfo])

  const isLoadingHistory = isFetching || isFetchingNextPage

  const { messages, input, handleInputChange, status, append, setInput } =
    useChat({
      id: screenName, // as different session
      api: isSelf
        ? `${process.env.PLASMO_PUBLIC_SERVER_URL}/users/chat`
        : `${process.env.PLASMO_PUBLIC_SERVER_URL}/users/chat/${screenName}`,
      streamProtocol: "text",
      fetch: async (url, options) => {
        const data = JSON.parse(options.body as string)
        const msg = data.messages.pop()
        const userMessage = msg.content
        const tweetId = msg.data?.tweet?.tweetId
        const quoteContent = msg.data?.tweet?.tweetText

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include", // cookie
          body: JSON.stringify({
            message: userMessage,
            tweetId,
            quote: quoteContent
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

  useEffect(() => {
    scrollToBottom()
  }, [quoteTweet])

  // scroll to bottom after init history
  useEffect(() => {
    const initHistory = async () => {
      await fetchNextPage()
      scrollToBottom()
    }
    initHistory()
  }, [])

  const isDisableStatus = useMemo(() => {
    return status === "submitted" || status === "streaming"
  }, [status])

  const isDisable = useMemo(() => {
    return isDisableStatus || isLoadingHistory
  }, [isDisableStatus])

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
    <div className="flex gap-y-6 rounded-md flex-col h-full flex-1 min-h-0">
      <div className="text-xs font-semibold min-h-[18px] flex items-center text-primary-brand">
        {!isSelf && screenName ? (
          `@${screenName}`
        ) : (
          <div className="mb-2 flex items-center text-xs font-semibold gap-x-1 text-text-default-primary">
            <ImageWithFallback
              src={robotImg}
              alt="robot"
              className="w-5 h-5 rounded-full object-contain"
              fallbackClassName="w-5 h-5 rounded-full"
            />
            xDaily
          </div>
        )}
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
            {m.data?.tweet && (
              <ChatTweetSection tweet={m.data.tweet} showClearButton={false} />
            )}
            <div
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`prose prose-sm break-words wrap w-fit max-w-[92%] p-3 rounded-lg message-item font-light text-sm border border-fill-bg-input ${
                  m.role === "user"
                    ? "bg-primary-brand text-text-inverse-primary"
                    : "bg-fill-bg-light text-text-default-primary"
                }`}>
                {m.role !== "user" && isSelf && (
                  <div className="mb-2 flex items-center text-xs font-semibold gap-x-1">
                    <ImageWithFallback
                      src={robotImg}
                      alt={m.role}
                      className="w-5 h-5 rounded-full object-contain"
                      fallbackClassName="w-5 h-5 rounded-full"
                    />
                    xDaily
                  </div>
                )}
                <Markdown>{m.content}</Markdown>
              </div>
            </div>
          </div>
        ))}

        {(status === "submitted" || status === "streaming") && (
          <div className="self-start bg-fill-bg-light text-text-default-primary0 p-3 rounded-lg border border-fill-bg-input w-fit animate-pulse">
            Thinking...
          </div>
        )}
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
        {showGreeting && (
          <EmptyContent
            content="Hi, How can I help you?"
            hideImage={true}
            textClassName="text-primary-brand"
          />
        )}
      </div>

      {/* input and send message button */}
      <div className="py-2 flex flex-col gap-1 relative shrink-0">
        <div className="flex mb-2 items-center justify-between gap-10">
          {!!models.length ? (
            <Select
              value={actModelId}
              onValueChange={setActModelId}
              disabled={!isSelf}>
              <SelectTrigger className="w-[176px]" size="sm">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.screenName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div />
          )}
          {isSelf && (
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
          )}
        </div>
        <form
          className="p-3 flex flex-col items-end rounded-xl overflow-hidden border border-primary-brand bg-fill-bg-light"
          onSubmit={(event) => handleFormSubmit(event)}>
          <textarea
            disabled={isDisableStatus}
            value={input}
            onChange={handleInputChange}
            rows={1}
            placeholder="Ask me anything... (Shift + Enter to add a line)"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleFormSubmit(e)
              }
            }}
            className="caret-primary-brand mb-1 w-full pb-0 focus:outline-none focus:ring-0 bg-transparent min-h-[70px] h-[70px] overflow-y-auto resize-none"
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
        {status === "error" && (
          <div className="px-2 text-[10px] text-red absolute top-full left-0 right-0 -translate-y-1/2 pt-1">
            Something wrong, please try again.
          </div>
        )}
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
