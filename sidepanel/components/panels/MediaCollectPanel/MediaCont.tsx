import type { FC } from "react"

import { ImageWithFallback } from "~sidepanel/components/ui/ImageWithFallback"
import type { ScanningMedia } from "~types/media"

export const MediaCont: FC<{
  media: ScanningMedia
  handleClick?: () => void
}> = ({ media, handleClick }) => {
  return (
    <div className="relative cursor-pointer" onClick={() => handleClick?.()}>
      <ImageWithFallback
        src={media.type === "img" ? media.src : media.poster}
        alt={media.src}
        className="w-full rounded-md break-inside-avoid"
        fallbackClassName="w-full rounded-md h-24"
      />
      <div className="z-2 absolute top-2 right-2 text-text-default-primary bg-purple px-1 rounded-sm">
        {media.type}
      </div>
    </div>
  )
}
