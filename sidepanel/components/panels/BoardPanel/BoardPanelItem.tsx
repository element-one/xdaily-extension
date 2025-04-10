import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {
  ChevronDown,
  ChevronRight,
  Ellipsis,
  FolderClosed,
  FolderOpen,
  Pencil,
  Pin,
  Share2,
  Trash2
} from "lucide-react"
import { useState, type FC } from "react"

export interface FolderItem {
  img: string
  title: string
  description: string
  href: string
}
export interface BoardPanelItemProps {
  folderCount: number
  folderName: string
  items: FolderItem[]
}
export const BoardPanelItem: FC<BoardPanelItemProps> = ({
  folderCount,
  folderName,
  items
}) => {
  const [isExpand, onToggleExpand] = useState(false)
  return (
    <div className="w-full list-none py-1">
      <div className="flex cursor-pointer gap-2 rounded-md px-2 py-1 transition-all duration-200 hover:bg-muted">
        <button>
          {isExpand ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <FolderClosed className="w-4 h-4" />
          )}
        </button>
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex w-full items-center gap-1">
            <button onClick={() => onToggleExpand(!isExpand)}>
              {isExpand ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <p className="text-base text-gray-400">({folderCount})</p>
            <p className="text-base">{folderName}</p>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <button>
                <Ellipsis className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-thinborder bg-white p-1 text-slate-900 shadow-md">
              <DropdownMenu.Item className="focus:bg-slate-100 relative flex select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors cursor-pointer gap-2 text-sm font-normal">
                <Pencil className="w-4 h-4" />
                Rename
              </DropdownMenu.Item>
              <DropdownMenu.Item className="focus:bg-slate-100 relative flex select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors cursor-pointer gap-2 text-sm font-normal">
                <Share2 className="w-4 h-4" />
                Share
              </DropdownMenu.Item>
              <DropdownMenu.Item className="focus:bg-slate-100 relative flex select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors cursor-pointer gap-2 text-sm font-normal">
                <Pin className="w-4 h-4" />
                Pin
              </DropdownMenu.Item>
              <DropdownMenu.Item className="focus:bg-slate-100 relative flex select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors cursor-pointer gap-2 text-sm font-normal">
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
      {isExpand && (
        <ul>
          {items.map((item) => {
            return (
              <li className="group/item m-1 ml-5 flex w-full cursor-pointer items-center gap-3 rounded-md p-2 transition-all duration-200 hover:bg-muted">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-blue-100" />
                </div>
                <div className="flex-1 flex-col">
                  <div className="line-clamp-2 text-sm font-normal">
                    {item.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
