// components/ui/input-box.tsx
import clsx from "clsx"
import * as React from "react"

export interface InputBoxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "caret-primary-brand w-full focus:outline-none focus:ring-0 bg-fill-bg-light border border-fill-bg-input rounded-lg h-9 p-2",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        {...props}
      />
    )
  }
)
InputBox.displayName = "InputBox"

export { InputBox }
