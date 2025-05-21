import { type FC } from "react"

import { formatTweetDate } from "~libs/date"
import type { TweetCollection } from "~types/collection"

type TweetListProps = TweetCollection
export const TweetItem: FC<TweetListProps> = (props) => {
  const handleClickTweetItem = () => {
    chrome.tabs.create({
      url: `${process.env.PLASMO_PUBLIC_MAIN_SITE}/knowledge-base/posts`
    })
  }

  return (
    <div
      className="w-full p-4 rounded-lg border border-fill-bg-input bg-fill-bg-deep hover:border-primary-brand cursor-pointer flex flex-row items-center justify-between relative"
      onClick={handleClickTweetItem}>
      <div className="flex items-center gap-3 max-w-[80%]">
        <div className="flex flex-col">
          <div className="text-sm flex items-center gap-x-1">
            <div className="font-semibold text-primary-brand">
              @{props.screenName}
            </div>
          </div>
          <div className="text-xs text-text-default-secondary line-clamp-4 px-1">
            {props.content}
          </div>
          {props.postedAt && (
            <div className="px-1 text-xs mt-1">
              {formatTweetDate(props.postedAt as any as string)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
