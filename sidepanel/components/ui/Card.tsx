import type { FC, ReactNode } from "react"

import { formatRelativeTime } from "~libs/date"

import { Divider } from "./Divider"

interface CardProps {
  onClick?: () => void
  title: string | ReactNode
  content?: string | ReactNode
  footerIcon: ReactNode
  footerTitle: string
  footerOperation?: ReactNode
  footerTime?: Date
}
export const Card: FC<CardProps> = ({
  onClick,
  title,
  content,
  footerTitle,
  footerIcon,
  footerOperation,
  footerTime
}) => {
  return (
    <div
      onClick={() => onClick?.()}
      className="border border-fill-bg-input rounded-lg py-3 bg-fill-bg-light hover:border-primary-brand flex cursor-pointer flex-col items-start gap-2 transition-all">
      <div className="text-text-default-primary truncate text-base font-semibold px-3 w-full">
        {title}
      </div>
      {content && (
        <div className="text-text-default-secondary text-sm font-medium line-clamp-4 px-3 w-full">
          {content}
        </div>
      )}
      <Divider />
      <div className="flex w-full items-center justify-between px-3 text-text-default-secondary">
        <span className="inline-flex items-center gap-x-1 text-sm font-light">
          {footerIcon}

          <span>{footerTitle} </span>
          {footerTime && (
            <>
              <span>·</span>
              <span>{formatRelativeTime(footerTime as any as string)}</span>
            </>
          )}
        </span>
        {footerOperation && (
          <span className="inline-flex items-center gap-x-2">
            {footerOperation}
          </span>
        )}
      </div>
    </div>
  )
}
