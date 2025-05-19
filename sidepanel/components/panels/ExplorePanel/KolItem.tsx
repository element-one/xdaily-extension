import type { FC } from "react"

import { Avatar } from "~sidepanel/components/ui/Avatar"
import type { KolCollection } from "~types/collection"
import { X_SITE } from "~types/enum"

// type KolItemProps = KolCollection

interface KolItemProps {
  item: KolCollection
  onClickItem?: () => void
}

export const KolItem: FC<KolItemProps> = ({ item: user, onClickItem }) => {
  const handleClickTweetItem = () => {
    chrome.tabs.create({
      url: `${X_SITE}/${user.screenName}`
    })
    onClickItem?.()
  }

  return (
    <div
      className="w-full p-4 rounded-lg border border-fill-bg-input bg-fill-bg-deep hover:border-primary-brand cursor-pointer"
      onClick={handleClickTweetItem}>
      <div>
        <Avatar alt={user.screenName} url={user.avatar} className="w-12 h-12" />
      </div>
      <div className="mt-4">
        <div className="text-base">{user.name}</div>
        <div className="text-sm text-primary-brand font-light">
          @{user.screenName}
        </div>
      </div>
      <div className="text-sm font-light mt-2">{user.bio}</div>
    </div>
  )
}
