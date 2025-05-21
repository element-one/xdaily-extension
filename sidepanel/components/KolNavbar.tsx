import clsx from "clsx"
import { useEffect, useMemo, useRef, useState, type FC } from "react"

import { useKolCollections } from "~services/collection"
import { useStore } from "~store/store"
import type { KolCollection } from "~types/collection"

import { Avatar } from "./ui/Avatar"

interface KolNavbarProps {}
export const KolNavbar: FC<KolNavbarProps> = ({}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useKolCollections(15, "")
  const bottomObserver = useRef<HTMLDivElement>(null)

  const { kolScreenName, setKolScreenName } = useStore()

  useEffect(() => {
    if (!hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    if (bottomObserver.current) observer.observe(bottomObserver.current)

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const collection = useMemo(() => {
    return [...(data?.pages ? data.pages : [])]
  }, [data])

  const handleClickKol = (kol: KolCollection) => {
    setKolScreenName(kol.screenName)
  }

  return (
    <div className="flex flex-col h-full text-white flex-1 min-h-0 overflow-y-auto hide-scrollbar">
      {!!collection?.length && (
        <section className="flex flex-col gap-4 flex-1 overflow-y-scroll stylized-scroll">
          {collection.map((kol) => (
            <div
              key={kol.id}
              onClick={() => handleClickKol(kol)}
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
      {/* load more */}
      <div ref={bottomObserver} className="h-6 w-full" />
    </div>
  )
}
