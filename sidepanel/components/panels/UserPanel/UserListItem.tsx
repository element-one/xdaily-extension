import { Bookmark, List, X } from "lucide-react"
import { type FC } from "react"

import { ListButton } from "~sidepanel/components/ListButton"
import type { UserCollection } from "~types/collection"
import { X_SITE } from "~types/enum"

type UserListProps = UserCollection
export const UserListItem: FC<UserListProps> = (user) => {
  const handleClickTweetItem = () => {
    chrome.tabs.create({
      url: `${X_SITE}/${user.screenName}`
    })
  }

  return (
    <div
      onClick={handleClickTweetItem}
      className="group flex flex-row items-center justify-between cursor-pointer border rounded-md bg-muted-light p-2 border-l-2 border-grey-500 hover:bg-purple-100 hover:border-purple-500 relative">
      <div className="flex flex-col items-start gap-y-2 max-w-[80%]">
        <div className="flex flex-row gap-x-1 items-center">
          <div className="size-7 rounded-full overflow-hidden bg-primary-brand">
            <img src={user.avatar} className=" object-contain" />
          </div>
          <div className="text-slate-900 text-xs">
            <div className="font-semibold text-slate-900">{user.name}</div>
            <div className="text-slate-600">@{user.screenName}</div>
          </div>
        </div>
        <div className="line-clamp-3 text-sm">{user.bio}</div>
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
