import {
  BotMessageSquare,
  EyeIcon,
  HandHeartIcon,
  TwitterIcon,
  UserRoundCheckIcon
} from "lucide-react"
import { type FC } from "react"

import { ListButton } from "~sidepanel/components/ListButton"
import type { UserCollection } from "~types/collection"
import { KolStatus, X_SITE } from "~types/enum"

type UserListProps = UserCollection

const CountInfoItem: FC<{
  number: number
  icon: React.ReactNode
}> = ({ number, icon }) => {
  function formatNumber(num: number) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "b"
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "m"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }
  return (
    <div className="flex items-center text-slate-700">
      {icon}
      <span>{formatNumber(number)}</span>
    </div>
  )
}
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
            <div className="font-semibold text-slate-900 flex items-center gap-x-1">
              <span>{user.name}</span>
              {/* <BadgeCheckIcon
                className={clsx(
                  "w-4 h-4 stroke-[2]",
                  user.isVerified ? "text-primary-brand" : "text-slate-900"
                )}
              /> */}
            </div>
            <div className="text-slate-600">@{user.screenName}</div>
          </div>
        </div>
        <div className="line-clamp-3 text-sm">{user.bio}</div>
        <div className="flex items-center gap-x-2">
          <CountInfoItem
            icon={<UserRoundCheckIcon className="w-4 h-4" />}
            number={user.followers}
          />

          <CountInfoItem
            icon={<HandHeartIcon className="w-4 h-4" />}
            number={user.following}
          />
          <CountInfoItem
            icon={<TwitterIcon className="w-4 h-4" />}
            number={user.tweets}
          />
        </div>
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
