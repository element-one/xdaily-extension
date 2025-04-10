import dayjs from "dayjs"
import { EyeIcon } from "lucide-react"
import { type FC } from "react"

import { ListButton } from "~sidepanel/components/ListButton"
import type { TweetCollection } from "~types/collection"

type TweetListProps = TweetCollection
export const TweetListItem: FC<TweetListProps> = (props) => {
  const handleClickTweetItem = () => {
    chrome.tabs.create({
      url: `${process.env.PLASMO_PUBLIC_MAIN_SITE}/library/bookmarks/posts`
    })
  }

  return (
    <div className="group flex flex-row items-center justify-between cursor-pointer border rounded-md bg-muted-light p-2 border-l-2 border-grey-500 hover:bg-blue-100 hover:border-blue-500 relative">
      <div className="flex items-center gap-3 max-w-[80%]">
        <div className="flex flex-col">
          <div className="text-sm flex items-center gap-x-1">
            <div className="font-semibold text-primary-brand">
              @{props.screenName}
            </div>
          </div>
          <div className="text-xs text-muted-foreground line-clamp-4 px-1">
            {props.content}
          </div>
          {props.postedAt && (
            <div className="px-1 text-xs mt-1">
              {dayjs(props.postedAt).format("h:mmA · YYYY/M/D")}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-3 items-center">
        <ListButton
          content={
            <EyeIcon className=" w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          }
          handleClick={handleClickTweetItem}
          tooltip="See Details"
        />
      </div>
    </div>
  )
}
