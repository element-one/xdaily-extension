import clsx from "clsx"
import React, { useState } from "react"

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallbackClassName,
  className,
  ...props
}) => {
  const [hasError, setHasError] = useState(false)

  if (hasError || !props.src) {
    return (
      <div
        className={clsx(
          "bg-fill-bg-input flex items-center justify-center",
          fallbackClassName ?? "h-20 w-20 rounded"
        )}
      />
    )
  }

  return (
    <img
      loading="lazy"
      {...props}
      className={clsx("object-cover", className)}
      onError={() => setHasError(true)}
    />
  )
}
