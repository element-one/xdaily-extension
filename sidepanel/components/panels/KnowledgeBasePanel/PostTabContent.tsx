import { useEffect, useMemo, useRef, useState, type FC } from "react"

import { formatTweetDate } from "~libs/date"
import { useTweetCollections } from "~services/collection"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { Skeleton } from "~sidepanel/components/ui/Skeleton"
import { type TweetCollection } from "~types/collection"
import { MessageType, type AddTweetCollectionPayload } from "~types/message"

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

const PostTabContentSkeleton = () => {
  return (
    <div className="mt-3 flex flex-col gap-2 py-2">
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="w-full p-4 rounded-lg border border-fill-bg-input bg-fill-bg-deep flex flex-row items-center justify-between relative">
            <div className="flex flex-col w-full">
              <Skeleton className="h-5 w-8" />
              <Skeleton className="w-full h-4 mt-2" />
              <Skeleton className="w-1/2 h-4 mt-1" />
              <Skeleton className="mt-2 w-10 h-4" />
            </div>
          </div>
        ))}
    </div>
  )
}

export const PostTabContent = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTweetCollections(15)
  const bottomObserver = useRef<HTMLDivElement>(null)

  const [addedCollection, setAddedCollection] = useState<TweetCollection[]>([])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (message: AddTweetCollectionPayload) => {
        if (message.type === MessageType.ADD_COLLECTION) {
          setAddedCollection((prev) => [message.data, ...prev])
        }
      }
    )
  }, [])

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
    return [...addedCollection, ...(data?.pages ? data.pages : [])]
  }, [addedCollection, data])

  if (isLoading) {
    return <PostTabContentSkeleton />
  }

  return (
    <main className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden pb-4 hide-scrollbar">
      {collection?.length > 0 ? (
        <section className="flex flex-col gap-2 py-2 overflow-y-scroll hide-scrollbar">
          {collection.map((item, index) => (
            <TweetItem key={index} {...item} />
          ))}
        </section>
      ) : (
        <EmptyContent content="Post is empty" />
      )}
      <div ref={bottomObserver} className="h-10" />
      {isFetchingNextPage && <p className="text-center">loading...</p>}
    </main>
  )
}
