import type { FC } from "react"

interface PanelHeaderProps {
  title: React.ReactNode | string
  rightContent?: React.ReactNode
}
export const PanelHeader: FC<PanelHeaderProps> = ({ title, rightContent }) => {
  return (
    <header className="flex-none h-8 flex items-center justify-between">
      <h1 className="text-base font-semibold flex gap-1 w-fit items-center">
        {title}
      </h1>
      {rightContent}
    </header>
  )
}
