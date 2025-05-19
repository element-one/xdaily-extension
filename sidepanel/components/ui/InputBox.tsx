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
          "w-full focus:outline-none focus:ring-0 bg-fill-bg-light border border-fill-bg-input rounded-lg h-9 p-2",
          className
        )}
        {...props}
      />
    )
  }
)
InputBox.displayName = "InputBox"

export { InputBox }
