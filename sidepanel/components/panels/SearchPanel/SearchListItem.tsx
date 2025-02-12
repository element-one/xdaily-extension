import * as Tooltip from "@radix-ui/react-tooltip"
import { Bookmark, List, X } from "lucide-react"
import { type FC, type ReactNode } from "react"

const ListButton: FC<{
  handleClick?: () => void
  content: ReactNode
  tooltip: string
}> = ({ handleClick, content, tooltip }) => {
  const handleItemClick = () => {
    handleClick?.()
  }
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger
          onClick={handleItemClick}
          className="cursor-pointer transition-all duration-300">
          {content}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-md border border-thinborder bg-muted px-3 py-1.5 text-sm text-foreground shadow-md"
            side="top">
            {tooltip}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

interface SearchListItemProps {
  name: string
  description: string
  // TODO deal with img
  img?: string
}
export const SearchListItem: FC<SearchListItemProps> = ({
  name,
  description
}) => {
  return (
    <div className="group flex flex-row items-center justify-between cursor-pointer border rounded-md bg-muted-light p-1 border-l-2 border-grey-500 hover:bg-purple-100 hover:border-purple-500 relative">
      <div className="flex items-center gap-3 max-w-[80%]">
        <div className="w-5 h-5 bg-purple-200"></div>
        <div className="flex flex-col">
          <div className="text-sm  line-clamp-1">{name} </div>
          <div className="text-xs text-muted-foreground ">{description} </div>
        </div>
      </div>
      <div className="flex flex-row gap-3 items-center">
        <ListButton
          content={
            <Bookmark className=" w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          }
          tooltip="Bookmark"
        />
        <ListButton
          content={
            <X className=" w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          }
          tooltip="Remove"
        />
        <ListButton
          content={
            <List className=" w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          }
          tooltip="More"
        />
      </div>
    </div>
  )
}
