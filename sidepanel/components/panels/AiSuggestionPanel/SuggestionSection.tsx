import * as Tooltip from "@radix-ui/react-tooltip"
import { Info, Save, Tags } from "lucide-react"
import { useState, type FC, type ReactNode } from "react"

import { InputWithEnterAndChange } from "./InputWithEnterAndChange"
import { SuggestionTag } from "./SuggestionTag"

interface SuggestionSectionProps {
  title: string
  titleIcon: ReactNode
  titleInfo: string
  selectedTags: string[]
  placeholder: string
  handleEnter?: (value: string) => void
  suggestionTitle: string
  suggestionTip: string
  suggestionItems: string[]
  handleSuggestionClick?: (value: string) => void
  handleDeleteClick?: (value: string) => void
}
export const SuggestionSection: FC<SuggestionSectionProps> = ({
  title,
  titleIcon,
  titleInfo,
  selectedTags,
  placeholder,
  handleEnter,
  suggestionTitle,
  suggestionTip,
  suggestionItems,
  handleSuggestionClick,
  handleDeleteClick
}) => {
  const [showTitleInfo, onToggleTitleInfo] = useState(false)

  const handleToggleTitleInfo = () => {
    onToggleTitleInfo(!showTitleInfo)
  }

  const onSuggestionClick = (value: string) => {
    handleSuggestionClick?.(value)
  }
  const onDeleteTagClick = (value: string) => {
    handleDeleteClick?.(value)
  }
  return (
    <div className="flex flex-col gap-y-2">
      <div className="bg-white flex flex-col gap-y-1">
        {/* title part */}
        <div className="flex flex-col gap-y-1">
          <div className="flex flex-row items-center justify-start gap-x-2">
            <h1 className="font-poppins font-medium flex items-center text-base gap-1 text-foreground leading-[175%] tracking-[0.15px]">
              {title}
            </h1>
            <div className="cursor-pointer" onClick={handleToggleTitleInfo}>
              {titleIcon}
            </div>
          </div>
          {showTitleInfo && (
            <p className="text-xs text-muted-foreground">{titleInfo}</p>
          )}
        </div>
        {/* selected tags */}
        <div className="hide-scrollbar flex gap-2 overflow-x-auto">
          {selectedTags &&
            selectedTags.map((tag, index) => (
              <SuggestionTag
                key={`${tag}${index}`}
                name={tag}
                addable={false}
                deletable={true}
                onTagClick={() => onDeleteTagClick(tag)}
              />
            ))}
        </div>
        {/* input part */}
        <InputWithEnterAndChange
          placeholder={placeholder}
          handleEnter={handleEnter}
        />
      </div>
      {suggestionItems?.length > 0 && (
        <div>
          <h1 className="flex items-center gap-1 font-poppins text-xs font-medium leading-[175%] tracking-[0.15px] text-foreground">
            {suggestionTitle}
            <Tooltip.Provider>
              <Tooltip.Root delayDuration={200}>
                <Tooltip.Trigger>
                  <Info className="w-4 h-5" />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="!w-2/3 rounded-md border border-thinborder bg-muted px-3 py-1.5 text-sm text-foreground shadow-md font-semibold"
                    side="top">
                    {suggestionTip}
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </h1>

          <div className="flex w-full flex-wrap gap-2 mt-1">
            {suggestionItems.map((name, index) => {
              return (
                <SuggestionTag
                  key={`${name}${index}`}
                  name={name}
                  addable={true}
                  onTagClick={() => onSuggestionClick(name)}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
