import React, { useState, type FC } from "react"

interface InputProps {
  placeholder: string
  handleEnter?: (value: string) => void
}
export const InputWithEnterAndChange: FC<InputProps> = ({
  placeholder,
  handleEnter
}) => {
  const [inputValue, setInputValue] = useState("")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputValue) return
    if (event.key === "Enter") {
      handleEnter?.(inputValue)
      setTimeout(() => {
        setInputValue("")
      }, 0)
    }
  }

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-active file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
    />
  )
}
