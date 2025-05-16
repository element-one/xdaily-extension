import { clsx } from "clsx"
import { LoaderCircleIcon } from "lucide-react"
import React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "ghost"
  isLoading?: boolean
  isDisabled?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      isLoading,
      isDisabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={clsx(
          "focus:outline-none focus:ring-0 focus:ring-ring",
          "inline-flex items-center justify-center rounded-lg font-light transition-colors hover:opacity-70 disabled:opacity-80 disabled:pointer-events-none",
          "h-9 px-2 flex-shrink-0 text-sm",
          {
            "bg-primary-brand text-text-inverse-primary": variant === "primary",
            "bg-transparent text-primary-brand border border-primary-brand":
              variant === "secondary",
            "bg-fill-bg-light text-text-default-primary border border-fill-bg-input":
              variant === "tertiary",
            "bg-transparent border-none": variant === "ghost"
          },
          className
        )}
        disabled={isLoading || isDisabled}
        ref={ref}
        {...props}>
        {isLoading ? (
          <LoaderCircleIcon className="w-4 h-4 animate-spin" />
        ) : (
          <>{children}</>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
