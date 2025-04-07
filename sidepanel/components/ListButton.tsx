import * as Tooltip from "@radix-ui/react-tooltip"
import { type FC, type ReactNode } from "react"

export const ListButton: FC<{
  handleClick?: () => void
  content: ReactNode
  tooltip: string
}> = ({ handleClick, content, tooltip }) => {
  const handleItemClick = () => {
    handleClick?.()
  }
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger
          onClick={handleItemClick}
          className="cursor-pointer transition-all duration-300">
          {content}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-md border border-thinborder bg-muted px-3 py-1.5 text-sm text-foreground shadow-md"
            side="top">
            {tooltip}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
