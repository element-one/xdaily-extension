import { CheckCheckIcon, ClockIcon, FileTextIcon } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"

import { formatTweetDate } from "~libs/date"
import { getI18nUrl } from "~libs/url"
import { useKnowledgeBaseCollections } from "~services/collection"
import DocIcon from "~sidepanel/components/icons/DocIcon"
import ExcelIcon from "~sidepanel/components/icons/ExcelIcon"
import PdfIcon from "~sidepanel/components/icons/PdfIcon"
import PPTIcon from "~sidepanel/components/icons/PPTIcon"
import TextIcon from "~sidepanel/components/icons/TextIcon"
import { Card } from "~sidepanel/components/ui/Card"
import { Divider } from "~sidepanel/components/ui/Divider"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { Skeleton } from "~sidepanel/components/ui/Skeleton"

const FileTabContentSkeleton = () => {
  return (
    <div className="mt-4 py-2 flex flex-col gap-4">
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="border border-fill-bg-input rounded-lg py-3 bg-fill-bg-light  flex flex-col items-start gap-2">
            <div className="w-full flex items-center gap-2 mx-3">
              <Skeleton className="h-5 w-5 rounded-full" />
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

export const FileTabContent = () => {
  const { t, i18n } = useTranslation()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useKnowledgeBaseCollections({
      take: 50,
      type: "file"
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
    return (data?.pages || []).map((item) => {
      const urlParts = (item.fileUrl ?? "").split("/")
      const fileName = urlParts[urlParts.length - 1]
      const fileType = item.type
      let fileIcon = <></>
      if (fileType.includes("pdf")) {
        fileIcon = <PdfIcon className="w-5 h-5 text-red" />
      } else if (fileType.includes("word") || fileType.includes("document")) {
        fileIcon = <DocIcon className="w-5 h-5 text-green" />
      } else if (
        fileType.includes("excel") ||
        fileType.includes("spreadsheet")
      ) {
        fileIcon = <ExcelIcon className="w-5 h-5 text-blue" />
      } else if (fileType.includes("image")) {
        fileIcon = <PPTIcon className="w-5 h-5 text-purple" />
      } else if (fileType.includes("text")) {
        fileIcon = <TextIcon className="w-5 h-5 text-cyan" />
      } else {
        fileIcon = (
          <div className="w-5 h-5 bg-gray-500/50 rounded-full flex items-center justify-center">
            <FileTextIcon className="w-3 text-gray-500" />
          </div>
        )
      }
      return {
        ...item,
        fileName,
        fileIcon
      }
    })
  }, [data])

  const handleOpen = () => {
    chrome.tabs.create({
      url: getI18nUrl("/knowledge-base/posts", i18n.language)
    })
  }

  return (
    <main className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden pb-4 hide-scrollbar">
      {isLoading ? (
        <FileTabContentSkeleton />
      ) : collection?.length > 0 ? (
        <>
          <section className="flex flex-col gap-2 py-3 overflow-y-scroll hide-scrollbar">
            {collection.map((item) => (
              <Card
                onClick={handleOpen}
                key={item.id}
                title={
                  <div className="flex items-center gap-2 w-full">
                    <span>{item.fileIcon}</span>
                    <span className="text-sm font-normal truncate w-full break-all">
                      {item.fileName}
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
        <EmptyContent content={t("knowledge_panel.empty_file")} />
      )}
      <div ref={bottomObserver} className="h-10" />
      {isFetchingNextPage && <p className="text-center">loading...</p>}
    </main>
  )
}
