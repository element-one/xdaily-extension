import {
  useChat,
  type UseChatHelpers,
  type Message as VercelMessage
} from "@ai-sdk/react"
import clsx from "clsx"
import { ArrowUpIcon, ClockIcon, XIcon } from "lucide-react"
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
  useGetUserAgentModels,
  useUpdateChatModelInfo
} from "~services/chat"
import { useStore } from "~store/store"
import { ChatType } from "~types/chat"
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
import { useToast } from "../ui/Toast"
import { Tooltip } from "../ui/Tooltip"
import { ChatMessage } from "./ChatMessage/ChatMessage"

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

  const { data: chatModelInfo, refetch } = useGetChatModelInfo(screenName)
  const { data: modelsResp } = useGetUserAgentModels(
    chatModelInfo?.agent?.id ?? ""
  )
  const {
    mutateAsync: updateChatModelInfo,
    isPending: isUpdatingChatModelInfo
  } = useUpdateChatModelInfo()

  const [actModelId, setActModelId] = useState("")
  const isFirstScroll = useRef(true)

  const models = useMemo(() => {
    if (!modelsResp) return []
    return modelsResp.data ?? []
  }, [modelsResp])

  useEffect(() => {
    if (chatModelInfo) {
      setActModelId(chatModelInfo.model.id ?? "")
    }
  }, [chatModelInfo])

  const { showToast } = useToast()

  const isLoadingHistory = isFetching || isFetchingNextPage

  const { messages, input, handleInputChange, status, append, setInput } =
    useChat({
      id: screenName, // as different session
      api: `${process.env.PLASMO_PUBLIC_SERVER_URL}/users/chat/${screenName}`,
      streamProtocol: "text",
      fetch: async (url, options) => {
        const data = JSON.parse(options.body as string)
        const msg = data.messages.pop()
        const userMessage = msg.content
        const tweetId = msg.data?.tweet?.tweetId
        const type = msg.data?.type

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include", // cookie
          body: JSON.stringify({
            message: userMessage,
            tweetId,
            type
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

  const showGreeting = allMessages.length === 0 && !quoteTweet

  const scrollToBottom = (options: ScrollToOptions = {}) => {
    setTimeout(() => {
      if (!chatRef.current) return
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior:
          options.behavior ?? (isFirstScroll.current ? "auto" : "smooth")
      })
    }, 0)
  }

  // scroll to bottom when come new message
  useEffect(() => {
    scrollToBottom()
    isFirstScroll.current = false
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [quoteTweet])

  // scroll to bottom after init history
  useEffect(() => {
    const initHistory = async () => {
      await fetchNextPage()
      scrollToBottom({ behavior: "auto" })
      isFirstScroll.current = false
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
      type: ChatType.MEMO,
      icon: <MemoIcon className="size-5" />,
      tooltip: "Save as Memo",
      magicWord: "Save as Memo"
    },
    {
      type: ChatType.SHEET,
      icon: <SheetIcon className="size-5" />,
      tooltip: "Save as Sheet",
      magicWord: "Save as Sheet"
    },
    {
      type: ChatType.REMINDER,
      icon: <ReminderIcon className="size-5" />,
      tooltip: "Remind later",
      magicWord: "Remind me later"
    }
  ]

  const handleClickToolButton = async (magicWord: string, type: ChatType) => {
    if (isDisable) return

    const data = quoteTweet ? { tweet: { ...quoteTweet }, type } : undefined

    removeQuoteTweet() // in case repeatedly send and make sure user can retry
    setInput("")

    await append({
      role: "user",
      content: magicWord,
      data
    })
  }

  // TODO server problem
  const handleChangeModel = async (modelId: string) => {
    try {
      await updateChatModelInfo({
        userAgentId: chatModelInfo?.id,
        modelId
      })
      setActModelId(modelId)
      refetch()
    } catch (e) {
      showToast({
        type: "error",
        title: "Error",
        description: "Something wrong, try later"
      })
    }
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
        className="flex-1 min-h-0 overflow-y-auto space-y-6 stylized-scroll pr-2"
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
            <ChatMessage
              content={m.content}
              role={m.role}
              isSelf={isSelf}
              key={m.id}
            />
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
        <div className="flex mb-2 items-center justify-between gap-2">
          {!!models.length ? (
            <Select
              value={actModelId}
              onValueChange={(value) => handleChangeModel(value)}
              disabled={!isSelf || isUpdatingChatModelInfo}>
              <SelectTrigger className="w-[176px] overflow-hidden" size="sm">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex gap-1 items-center">
                      <ImageWithFallback
                        src={model.iconUrl}
                        alt={model.id}
                        className="w-4 h-4 rounded-full bg-white"
                        fallbackClassName="w-4 h-4 rounded-full bg-white"
                      />
                      {model.screenName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div />
          )}
          {isSelf && (
            <div className="flex gap-4 items-center shrink-0">
              {Tools.map((tool) => (
                <Tooltip key={tool.type} content={tool.tooltip}>
                  <div
                    onClick={() =>
                      handleClickToolButton(tool.magicWord, tool.type)
                    }
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
