import { CheckIcon } from "lucide-react"
import type { FC, ReactNode } from "react"

import { Button } from "~sidepanel/components/ui/Button"
import { Tooltip } from "~sidepanel/components/ui/Tooltip"

interface ActionButtonProps {
  tooltip: string
  successTooltip: string
  icon: ReactNode
  isLoading: boolean
  isDisabled: boolean
  isSuccess: boolean
  onClick: () => void
}
export const ActionButton: FC<ActionButtonProps> = ({
  tooltip,
  successTooltip,
  icon,
  isLoading,
  isDisabled,
  isSuccess,
  onClick
}) => {
  if (isSuccess) {
    return (
      <Tooltip content={successTooltip}>
        <CheckIcon className="w-4 h-4 text-green" />
      </Tooltip>
    )
  }

  return (
    <Tooltip content={tooltip}>
      <Button
        variant="ghost"
        className="!p-0"
        isLoading={isLoading}
        isDisabled={isDisabled}
        onClick={onClick}>
        {icon}
      </Button>
    </Tooltip>
  )
}
