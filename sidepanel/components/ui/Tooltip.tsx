import * as RadixTooltip from "@radix-ui/react-tooltip"
import type { ReactNode } from "react"

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
  delayDuration?: number
  className?: string
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 0,
  delayDuration,
  className = ""
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={`relative z-50 bg-fill-bg-light border-[1px] border-fill-bg-input rounded-lg px-3 py-2.5 text-text-default-regular text-base ${className}`}>
            {content}
            <RadixTooltip.Arrow className="fill-fill-bg-light stroke-[1px] stroke-fill-bg-input" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
