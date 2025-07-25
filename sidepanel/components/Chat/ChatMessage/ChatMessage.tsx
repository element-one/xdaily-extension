import type { Message as VercelMessage } from "@ai-sdk/react"
import Markdown from "markdown-to-jsx"
import type { FC, ReactNode } from "react"
import robotImg from "url:/assets/robot.png" // strange

import { normalizeMarkdownInput } from "~libs/chat"
import { ImageWithFallback } from "~sidepanel/components/ui/ImageWithFallback"
import type {
  ChatMessageData,
  ErrorMessageData,
  MemoMessageData,
  ReminderMessageData,
  SheetMessageData
} from "~types/chat"

import {
  ErrorMessageRenderer,
  MemoMessageRenderer,
  ReminderMessageRenderer,
  SheetMessageRenderer
} from "./MessageRenderer"
import { tryParseJsonMessage } from "./utils"

interface ChatMessageProps {
  content: string
  role: VercelMessage["role"]
  robotAvatar?: string
  displayScreenName?: string
}
export const ChatMessage: FC<ChatMessageProps> = ({
  content,
  role,
  robotAvatar,
  displayScreenName
}) => {
  const jsonData = tryParseJsonMessage(content)

  const renderMessageContent = (jsonData: ChatMessageData): ReactNode => {
    // Handle JSON formatted messages
    try {
      if ("error" in jsonData) {
        return <ErrorMessageRenderer errorData={jsonData as ErrorMessageData} />
      } else if (jsonData.type === "memo") {
        return <MemoMessageRenderer data={jsonData as MemoMessageData} />
      } else if (jsonData.type === "sheet") {
        return <SheetMessageRenderer data={jsonData as SheetMessageData} />
      } else if (jsonData.type === "reminder") {
        return (
          <ReminderMessageRenderer data={jsonData as ReminderMessageData} />
        )
      }
      return (
        <ErrorMessageRenderer
          errorData={{ error: "Something wrong" } as ErrorMessageData}
        />
      )
    } catch (e) {
      return (
        <ErrorMessageRenderer
          errorData={{ error: "Something wrong" } as ErrorMessageData}
        />
      )
    }
  }

  if (!jsonData || typeof jsonData !== "object" || Array.isArray(jsonData)) {
    return (
      <div
        className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
        <div
          className={`break-words wrap w-fit max-w-[92%] p-3 rounded-lg message-item font-light text-sm border border-fill-bg-input ${
            role === "user"
              ? "bg-primary-brand text-text-inverse-primary"
              : "bg-fill-bg-light text-text-default-primary"
          }`}>
          <RobotLogo
            avatar={robotAvatar}
            show={role !== "user"}
            name={displayScreenName}
          />
          <div className="max-w-full overflow-auto markdown-content">
            <Markdown>{normalizeMarkdownInput(content)}</Markdown>
          </div>
        </div>
      </div>
    )
  }

  //   Handle JSON formatted messages
  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`break-words wrap w-full message-item font-light text-sm`}>
        <RobotLogo
          avatar={robotAvatar}
          show={role !== "user"}
          name={displayScreenName}
        />
        {renderMessageContent(jsonData)}
      </div>
    </div>
  )
}

const RobotLogo: FC<{ avatar?: string; show: boolean; name?: string }> = ({
  avatar,
  name,
  show
}) => {
  if (!show) {
    return <></>
  }
  const robotAvatar = avatar ? avatar : robotImg
  const screenName = name ? `@${name}` : "xDaily"
  return (
    <div className="mb-2 flex items-center text-xs font-semibold gap-x-1">
      <ImageWithFallback
        src={robotAvatar}
        alt={"Robot"}
        className="w-5 h-5 rounded-full object-contain"
        fallbackClassName="w-5 h-5 rounded-full"
      />
      {screenName}
    </div>
  )
}
