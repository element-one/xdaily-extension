import { SearchIcon, XIcon } from "lucide-react"
import { useState, type FC } from "react"

import { Button } from "./Button"
import { InputBox } from "./InputBox"

interface PanelHeaderProps {
  title: React.ReactNode | string
  rightContent?: React.ReactNode
  showSearchButton?: boolean
  onSearchChange?: (value: string) => void
  extraRightContent?: React.ReactNode
}
export const PanelHeader: FC<PanelHeaderProps> = ({
  title,
  showSearchButton = false,
  onSearchChange,
  extraRightContent
}) => {
  const [showSearchSection, setShowSearchSection] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const toggleSearch = () => {
    setShowSearchSection((prev) => !prev)
    setSearchValue("")
    onSearchChange?.("")
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    onSearchChange?.(e.target.value)
  }
  return (
    <header className="relative flex-none h-8 flex items-center justify-between">
      <h1 className="text-base font-semibold flex gap-1 w-fit items-center">
        {title}
      </h1>
      {/* {rightContent} */}
      <div className="flex items-center gap-x-2">
        {showSearchButton && (
          <Button variant="ghost" className="!p-0" onClick={toggleSearch}>
            <SearchIcon className="w-5 h-5 text-text-default-regular" />
          </Button>
        )}
        {!!extraRightContent && extraRightContent}
      </div>
      {showSearchSection && (
        <div className="absolute inset-0 gap-2 flex items-center bg-fill-bg-deep z-10">
          <InputBox
            autoFocus
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search memo"
            className="!bg-fill-bg-deep h-6 border-none flex-1 min-w-0 !rounded-none"
          />
          <Button
            variant="ghost"
            onClick={toggleSearch}
            className="!p-0 shrink-0">
            <XIcon className="w-4 h-4 text-text-default-secondary" />
          </Button>
        </div>
      )}
    </header>
  )
}
