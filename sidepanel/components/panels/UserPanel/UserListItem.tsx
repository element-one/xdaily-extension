import { BotMessageSquare, EyeIcon } from "lucide-react"
import { type FC } from "react"

import { ListButton } from "~sidepanel/components/ListButton"
import type { UserCollection } from "~types/collection"
import { KolStatus, X_SITE } from "~types/enum"

type UserListProps = UserCollection
export const UserListItem: FC<UserListProps> = (user) => {
  const handleClickTweetItem = () => {
    chrome.tabs.create({
      url: `${X_SITE}/${user.screenName}`
    })
  }

  return (
    <div className="group flex flex-row items-center justify-between cursor-pointer border rounded-md bg-muted-light p-2 border-l-2 border-grey-500 hover:bg-blue-100 hover:border-blue-500 relative">
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
            <EyeIcon className=" w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          }
          handleClick={handleClickTweetItem}
          tooltip="Go Profile Page"
        />
        {user.kolStatus === KolStatus.APPROVED && (
          <ListButton
            content={
              <BotMessageSquare className=" w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            }
            handleClick={handleClickTweetItem}
            tooltip="Chat"
          />
        )}
      </div>
    </div>
  )
}
