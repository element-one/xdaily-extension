import clsx from "clsx"
import type { FC } from "react"

interface AvatarProps {
  url: string
  alt?: string
  className?: string
}
const wrapperClassName =
  "w-6 h-6 rounded-full border-[1px] border-border-regular bg-border-regular flex items-center justify-center overflow-hidden"
export const Avatar: FC<AvatarProps> = ({ url, alt, className }) => {
  if (!url) {
    return <div className={clsx(wrapperClassName, className)} />
  }
  return (
    <div className={clsx(wrapperClassName, className)}>
      <img
        src={url}
        alt={alt || "user avatar"}
        className="size-full object-contain"
      />
    </div>
  )
}
