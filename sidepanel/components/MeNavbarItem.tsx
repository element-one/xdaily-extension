import clsx from "clsx"
import type { FC } from "react"

import { Tooltip } from "./ui/Tooltip"

interface MeNavbarItemProps {
  handleClick?: () => void
  isTargeted: boolean
  tooltip: string
  icon: React.ComponentType<{ className?: string }>
}
export const MeNavbarItem: FC<MeNavbarItemProps> = ({
  handleClick,
  isTargeted,
  icon: Icon,
  tooltip
}) => {
  const handleItemClick = () => {
    handleClick?.()
  }
  return (
    <Tooltip content={tooltip} side="left">
      <div
        onClick={handleItemClick}
        className={clsx(
          "flex h-9 w-9 min-w-9 items-center justify-center rounded-full transition-colors cursor-pointer",
          "text-fill-layer-layer hover:bg-white/10 bg-transparent border-[#404040]/80 border-0",
          isTargeted && "navitem-selected-shadow bg-white/10 border "
        )}>
        <Icon
          className={clsx(
            "h-6 w-6 text-2xl transition-transform group-hover:scale-110",
            isTargeted ? "text-primary-brand" : "text-fill-layer-layer"
          )}
        />
      </div>
    </Tooltip>
  )
}
