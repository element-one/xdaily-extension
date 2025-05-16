import type { FC } from "react"

interface EmptyContentProps {
  content: string
}
export const EmptyContent: FC<EmptyContentProps> = ({ content }) => {
  return (
    <div className="text-primary-brand w-full h-full flex items-center justify-center text-lg">
      {content}
    </div>
  )
}
