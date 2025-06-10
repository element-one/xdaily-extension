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
  isSelf: boolean
}
export const ChatMessage: FC<ChatMessageProps> = ({
  content,
  role,
  isSelf
}) => {
  const jsonData = tryParseJsonMessage(content)

  const renderMessageContent = (jsonData: ChatMessageData): ReactNode => {
    // Handle JSON formatted messages
    if ("error" in jsonData) {
      return <ErrorMessageRenderer errorData={jsonData as ErrorMessageData} />
    } else if (jsonData.type === "memo") {
      return <MemoMessageRenderer data={jsonData as MemoMessageData} />
    } else if (jsonData.type === "sheet") {
      return <SheetMessageRenderer data={jsonData as SheetMessageData} />
    } else if (jsonData.type === "reminder") {
      return <ReminderMessageRenderer data={jsonData as ReminderMessageData} />
    }
    return <ErrorMessageRenderer errorData={jsonData as ErrorMessageData} />
  }

  if (!jsonData || typeof jsonData !== "object" || Array.isArray(jsonData)) {
    return (
      <div
        className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
        <div
          className={`prose prose-sm break-words wrap w-fit max-w-[92%] p-3 rounded-lg message-item font-light text-sm border border-fill-bg-input ${
            role === "user"
              ? "bg-primary-brand text-text-inverse-primary"
              : "bg-fill-bg-light text-text-default-primary"
          }`}>
          <RobotLogo show={role !== "user" && isSelf} />
          <Markdown>{normalizeMarkdownInput(content)}</Markdown>
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
        <RobotLogo show={role !== "user" && isSelf} />
        {renderMessageContent(jsonData)}
      </div>
    </div>
  )
}

const RobotLogo: FC<{ show: boolean }> = ({ show }) => {
  if (!show) return <></>
  return (
    <div className="mb-2 flex items-center text-xs font-semibold gap-x-1">
      <ImageWithFallback
        src={robotImg}
        alt={"Robot"}
        className="w-5 h-5 rounded-full object-contain"
        fallbackClassName="w-5 h-5 rounded-full"
      />
      xDaily
    </div>
  )
}
