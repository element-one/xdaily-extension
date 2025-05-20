import clsx from "clsx"

import type { ComponentProps, FC } from "~node_modules/@types/react"

export const Skeleton: FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="skeleton"
      className={clsx("bg-fill-bg-input animate-pulse rounded-md", className)}
      {...props}
    />
  )
}
