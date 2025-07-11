import type { FC } from "react"

import { Avatar } from "~sidepanel/components/ui/Avatar"
import { useStore } from "~store/store"
import type { KolCollection } from "~types/collection"

interface KolItemProps {
  item: KolCollection
}

export const KolItem: FC<KolItemProps> = ({ item: user }) => {
  const { setKolScreenName, setKolAvatarUrl } = useStore()

  const handleClickTweetItem = (screenName: string, url?: string) => {
    setKolScreenName(screenName)
    setKolAvatarUrl(url ?? "")
  }

  return (
    <div
      className="w-full p-4 rounded-lg border border-fill-bg-input bg-fill-bg-deep hover:border-primary-brand cursor-pointer"
      onClick={() => handleClickTweetItem(user.screenName, user.avatar)}>
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
