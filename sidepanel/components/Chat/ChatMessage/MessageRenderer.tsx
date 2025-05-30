// import { ErrorMessageData, MemoMessageData, SheetMessageData } from '../types'
import { CopyPlusIcon, SaveIcon } from "lucide-react"
import type { FC, ReactNode } from "react"

import { Button } from "~sidepanel/components/ui/Button"
import { Divider } from "~sidepanel/components/ui/Divider"
import { Tooltip } from "~sidepanel/components/ui/Tooltip"
import type {
  ErrorMessageData,
  MemoMessageData,
  SheetMessageData
} from "~types/chat"

const BasicRenderer: FC<{
  title?: string
  children: ReactNode
  actions?: ReactNode
}> = ({ title, children, actions }) => {
  return (
    <div className="bg-fill-bg-light rounded-xl border border-fill-bg-input p-3 w-full flex flex-col gap-2">
      <h3 className="font-semibold text-primary-brand">{title}</h3>
      <div className="space-y-2">{children}</div>
      <Divider />
      <div className="flex gap-2 items-center justify-end">{actions}</div>
    </div>
  )
}

export const MemoMessageRenderer: FC<{ data: MemoMessageData }> = ({
  data
}) => {
  return (
    <BasicRenderer
      title={data.title}
      actions={
        <>
          <Tooltip content="Save as new memo">
            <Button variant="ghost" className="!p-0">
              <SaveIcon className="w-4 h-4 text-primary-brand" />
            </Button>
          </Tooltip>
          <Tooltip content="Append to latest memo">
            <Button variant="ghost" className="!p-0">
              <CopyPlusIcon className="w-4 h-4 text-white" />
            </Button>
          </Tooltip>
        </>
      }>
      {data.content.map((item, index) => {
        if (item.type === "paragraph") {
          return (
            <p key={index} className="text-sm">
              {item.content}
            </p>
          )
        } else if (item.type === "quote") {
          return (
            <blockquote
              key={index}
              className="border-l-2 border-gray-300 pl-3 italic">
              {item.content}
            </blockquote>
          )
        }
        return null
      })}
    </BasicRenderer>
  )
}

export const SheetMessageRenderer: FC<{ data: SheetMessageData }> = ({
  data
}) => {
  return (
    <BasicRenderer
      title={data.title}
      actions={
        <>
          <Tooltip content="Save as new sheet">
            <Button variant="ghost" className="!p-0">
              <SaveIcon className="w-4 h-4 text-primary-brand" />
            </Button>
          </Tooltip>
          <Tooltip content="Append to latest sheet">
            <Button variant="ghost" className="!p-0">
              <CopyPlusIcon className="w-4 h-4 text-white" />
            </Button>
          </Tooltip>
        </>
      }>
      This is a sheet
    </BasicRenderer>
  )
}

export const ReminderMessageRenderer: FC = () => {
  return (
    <BasicRenderer
      title="Reminder"
      actions={
        <>
          <Tooltip content="Save as new reminder">
            <Button variant="ghost" className="!p-0">
              <SaveIcon className="w-4 h-4 text-primary-brand" />
            </Button>
          </Tooltip>
          <Tooltip content="Append to latest reminder">
            <Button variant="ghost" className="!p-0">
              <CopyPlusIcon className="w-4 h-4 text-white" />
            </Button>
          </Tooltip>
        </>
      }>
      This is a reminder
    </BasicRenderer>
  )
}

export const ErrorMessageRenderer: FC<{ errorData: ErrorMessageData }> = ({
  errorData
}) => {
  return (
    <div className="bg-[rgba(255,59,58,0.5)] rounded-xl px-3 py-1 w-full flex flex-col">
      <h3 className="text-colors-red font-semibold">Error</h3>
      <p className="text-sm">{errorData.error}</p>
    </div>
  )
}
