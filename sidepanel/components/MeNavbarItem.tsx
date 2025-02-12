import * as Tooltip from "@radix-ui/react-tooltip"
import clsx from "clsx"
import { type FC, type ReactNode } from "react"

interface MeNavbarItemProps {
  handleClick?: () => void
  isTargeted: boolean
  content: ReactNode
  tooltip: string
}
export const MeNavbarItem: FC<MeNavbarItemProps> = ({
  handleClick,
  isTargeted,
  content,
  tooltip
}) => {
  const handleItemClick = () => {
    handleClick?.()
  }
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger
          onClick={handleItemClick}
          className={clsx(
            "cursor-pointer p-2 bg-white hover:bg-purple-100 rounded-lg transition-colors duration-200",
            isTargeted ? "text-primary-brand" : "text-gray-500"
          )}>
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
