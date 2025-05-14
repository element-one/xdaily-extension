import { clsx } from "clsx"
import React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        className={clsx(
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "inline-flex items-center justify-center rounded-card-s font-light transition-colors hover:opacity-70 disabled:opacity-50 disabled:pointer-events-none",
          "h-9 px-2 flex-shrink-0 text-sm",
          {
            "bg-primary-brand text-text-inverse-primary": variant === "primary",
            "bg-transparent text-primary-brand border border-primary-brand":
              variant === "secondary",
            "bg-fill-bg-light text-text-default-primary border border-fill-bg-input":
              variant === "tertiary"
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
