import { CheckCheckIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState, type FC } from "react"
import { useTranslation } from "react-i18next"

import { formatTweetDate } from "~libs/date"
import { getI18nUrl } from "~libs/url"
import { useKnowledgeBaseCollections } from "~services/collection"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { Skeleton } from "~sidepanel/components/ui/Skeleton"
import { type PostCollection, type TweetCollection } from "~types/collection"
import { MessageType, type AddTweetCollectionPayload } from "~types/message"

interface TweetListProps {
  screenName: string
  content: string
  postedAt: string
  isSelected: boolean
}
export const TweetItem: FC<TweetListProps> = (props) => {
  const { i18n } = useTranslation()
  const handleClickTweetItem = () => {
    chrome.tabs.create({
      url: getI18nUrl("/knowledge-base/posts", i18n.language)
    })
  }

  return (
    <div
      className="w-full p-4 rounded-lg border border-fill-bg-input bg-fill-bg-deep hover:border-primary-brand cursor-pointer flex flex-row items-center justify-between relative"
      onClick={handleClickTweetItem}>
      <div className="flex items-center gap-3 max-w-[80%]">
        <div className="flex flex-col">
          <div className="text-sm flex items-center gap-x-1">
            <div className="font-semibold text-primary-brand line-clamp-1 break-all">
              @{props.screenName}
            </div>
          </div>
          <div className="text-xs text-text-default-secondary line-clamp-4 px-1 break-all">
            {props.content}
          </div>
          {props.postedAt && (
            <div className="px-1 text-xs mt-1 pr-4">
              {formatTweetDate(props.postedAt as any as string)}
            </div>
          )}
        </div>
      </div>
      <div>
        {props.isSelected && (
          <CheckCheckIcon className="text-primary-brand w-4 h-4 absolute right-4 bottom-4" />
        )}
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
  const { t } = useTranslation()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useKnowledgeBaseCollections({
      take: 50,
      type: "post"
    })
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
    const apiPostData = ((data?.pages ?? []) as PostCollection[]).map(
      (postCollection) => ({
        content: postCollection.tweet?.content ?? postCollection.content ?? "",
        postedAt:
          postCollection.tweet?.timestamp ?? postCollection.createdAt ?? "",
        screenName: postCollection.tweet?.screenName ?? postCollection.id ?? "",
        id: postCollection.id,
        isSelected: postCollection.isSelected
      })
    )

    const addedData = addedCollection.map((collection) => ({
      content: collection.content,
      postedAt: collection.postedAt,
      screenName: collection.screenName,
      id: collection.tweetId,
      isSelected: true // default to select
    }))

    return [...addedData, ...apiPostData]
  }, [addedCollection, data])

  if (isLoading) {
    return <PostTabContentSkeleton />
  }

  return (
    <main className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden pb-4 hide-scrollbar">
      {collection?.length > 0 ? (
        <section className="flex flex-col gap-2 py-2 overflow-y-scroll hide-scrollbar">
          {collection.map((item, index) => (
            <TweetItem
              key={index}
              screenName={item.screenName}
              content={item.content}
              postedAt={item.postedAt as any as string}
              isSelected={item.isSelected}
            />
          ))}
        </section>
      ) : (
        <EmptyContent content={t("knowledge_panel.empty_post")} />
      )}
      <div ref={bottomObserver} className="h-10" />
      {isFetchingNextPage && <p className="text-center">loading...</p>}
    </main>
  )
}
