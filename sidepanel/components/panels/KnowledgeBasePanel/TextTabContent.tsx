import { CheckCheckIcon, ClockIcon } from "lucide-react"
import { useEffect, useMemo, useRef, type FC } from "react"

import { formatTweetDate } from "~libs/date"
import { useKnowledgeBaseCollections } from "~services/collection"
import { Card } from "~sidepanel/components/ui/Card"
import { Divider } from "~sidepanel/components/ui/Divider"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { Skeleton } from "~sidepanel/components/ui/Skeleton"

const TextTabContentSkeleton = () => {
  return (
    <div className="mt-4 py-2 flex flex-col gap-4">
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="border border-fill-bg-input rounded-lg py-3 bg-fill-bg-light  flex flex-col items-start gap-2">
            <div className="w-full flex items-center gap-2 mx-3">
              <Skeleton className="w-2/3 h-5" />
            </div>
            <Divider />
            <div className="flex w-full items-center justify-between text-text-default-secondary">
              <span className="inline-flex items-center gap-x-1 mx-3">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-4 w-8" />
                <span>·</span>
                <Skeleton className="h-4 w-10" />
              </span>
            </div>
          </div>
        ))}
    </div>
  )
}

export const TextTabContent = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useKnowledgeBaseCollections({
      take: 15,
      equalsType: "text"
    })
  const bottomObserver = useRef<HTMLDivElement>(null)

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
    return data?.pages ?? []
  }, [data])

  const handleOpen = (url?: string) => {
    if (url) {
      window.open(url, "_blank")
    } else {
      chrome.tabs.create({
        url: `${process.env.PLASMO_PUBLIC_MAIN_SITE}/knowledge-base/posts`
      })
    }
  }

  return (
    <main className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden pb-4 hide-scrollbar">
      {isLoading ? (
        <TextTabContentSkeleton />
      ) : collection?.length > 0 ? (
        <>
          <section className="flex flex-col gap-2 py-3 overflow-y-scroll hide-scrollbar">
            {collection.map((item) => (
              <Card
                onClick={() => {
                  handleOpen(item.fileUrl)
                }}
                key={item.id}
                title={
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-sm font-normal truncate w-full break-all">
                      {item.content}
                    </span>
                  </div>
                }
                footerIcon={<ClockIcon className="w-4 h-4 text-orange" />}
                footerTitle={formatTweetDate(item.createdAt as any as string)}
                footerOperation={
                  item.isSelected && (
                    <CheckCheckIcon className="text-primary-brand w-4 h-4" />
                  )
                }
              />
            ))}
          </section>
        </>
      ) : (
        <EmptyContent content="File is empty" />
      )}
      <div ref={bottomObserver} className="h-10" />
      {isFetchingNextPage && <p className="text-center">loading...</p>}
    </main>
  )
}
