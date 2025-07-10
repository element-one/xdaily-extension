import clsx from "clsx"
import { useMemo, type FC } from "react"

import { useGetTopChatUsers } from "~services/chat"
import { useStore } from "~store/store"

import { Avatar } from "../ui/Avatar"

interface KolNavbarProps {}
export const KolNavbar: FC<KolNavbarProps> = ({}) => {
  const { data } = useGetTopChatUsers()

  const { kolScreenName, setKolScreenName } = useStore()

  const handleClickKol = (screenName: string) => {
    setKolScreenName(screenName)
  }

  const collection = useMemo(() => {
    return (data ?? []).map((topChatUser) => topChatUser.twitterUser)
  }, [data])

  return (
    <div className="flex flex-col h-full text-white flex-1 min-h-0 overflow-y-auto hide-scrollbar">
      {!!collection?.length && (
        <section className="flex flex-col gap-4 flex-1 overflow-y-scroll stylized-scroll">
          {collection.map((kol) => (
            <div
              key={kol.id}
              onClick={() => handleClickKol(kol.screenName)}
              className={clsx(
                "cursor-pointer w-9 h-9 flex items-center justify-center border rounded-full",
                kolScreenName === kol.screenName
                  ? "border-border-regular"
                  : "border-transparent"
              )}>
              <Avatar
                className="w-6 h-6"
                url={kol.avatar}
                alt={kol.screenName}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
