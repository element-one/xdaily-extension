import { Bookmark, List, X } from "lucide-react"
import { type FC } from "react"

import { ListButton } from "./ListButton"

interface SearchListItemProps {
  name: string
  description: string
  img?: string
}
export const SearchListItem: FC<SearchListItemProps> = ({
  name,
  description
}) => {
  return (
    <div className="group flex flex-row items-center justify-between cursor-pointer border rounded-md bg-muted-light p-1 border-l-2 border-grey-500 hover:bg-purple-100 hover:border-purple-500 relative">
      <div className="flex items-center gap-3 max-w-[80%]">
        <div className="flex flex-col">
          <div className="text-sm  line-clamp-1">{name} </div>
          <div className="text-xs text-muted-foreground line-clamp-3">
            {description}{" "}
          </div>
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
