import {
  EllipsisIcon,
  PlusIcon,
  SearchIcon,
  Share2Icon,
  Trash2Icon
} from "lucide-react"
import { useEffect, useMemo, useRef } from "react"

import { useCreateSheet, useSheetList } from "~services/sheet"
import { Button } from "~sidepanel/components/ui/Button"
import { Card } from "~sidepanel/components/ui/Card"
import { Divider } from "~sidepanel/components/ui/Divider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~sidepanel/components/ui/DropdownMenu"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import { Skeleton } from "~sidepanel/components/ui/Skeleton"
import type { SheetItem } from "~types/sheet"

const SheetPanelSkeleton = () => {
  return (
    <div className="mt-4 py-2 flex flex-col gap-4">
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="border border-fill-bg-input rounded-lg py-3 bg-fill-bg-light  flex flex-col items-start gap-2">
            <Skeleton className="h-6 w-8 mx-3" />
            <Skeleton className="w-2/3 h-5 mx-3" />
            <Divider />
            <div className="flex w-full items-center justify-between text-text-default-secondary">
              <span className="inline-flex items-center gap-x-1">
                <Skeleton className="w-4 rounded-full" />
                <Skeleton className="h-5 w-8" />
                <span>·</span>
                <Skeleton className="h-5 w-10" />
              </span>
            </div>
          </div>
        ))}
    </div>
  )
}
export const SheetPanel = () => {
  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch: refetchSheetList,
    isLoading
  } = useSheetList(15)
  const { mutateAsync: createSheet, isPending: isCreatingSheet } =
    useCreateSheet()
  // const { mutateAsync: deleteSheet } = useDeleteSheet()

  const bottomObserver = useRef<HTMLDivElement>(null)

  const handleGoSheetPage = () => {
    chrome.tabs.create({
      url: `${process.env.PLASMO_PUBLIC_MAIN_SITE}/sheet`
    })
  }

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

  const sheetData = useMemo(() => {
    return data?.pages ? data.pages : []
  }, [data])

  const handleCreateSheet = async () => {
    try {
      await createSheet({
        title: "Untitled",
        content: {
          // TODO
          item: JSON.stringify({})
        }
      })
      refetchSheetList()
    } catch (e) {}
  }

  const handleDeleteSheet = async (sheet: SheetItem) => {
    // try {
    //   await deleteSheet({ id: sheet.id })
    //   refetchSheetList()
    // } catch (e) {}
  }

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Sheet"
        rightContent={
          <div className="flex items-center gap-x-2">
            <button className="w-5 h-5 flex items-center justify-center focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50">
              <SearchIcon className="w-5 h-5 text-text-default-regular" />
            </button>
            <Button
              variant="ghost"
              isDisabled={isCreatingSheet}
              onClick={handleCreateSheet}
              className="p-0">
              <div className="text-primary-brand border-[2px] rounded-md border-primary-brand w-4 h-4 flex items-center justify-center">
                <PlusIcon className="w-4 h-4" strokeWidth={4} />
              </div>
            </Button>
          </div>
        }
      />
      {isLoading ? (
        <SheetPanelSkeleton />
      ) : (
        <main className="flex-1 min-h-0 flex flex-col overflow-y-hidden overflow-x-hidden py-4">
          {!!sheetData.length ? (
            <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-scroll stylized-scroll">
              {sheetData.map((item) => (
                <Card
                  key={item.id}
                  onClick={handleGoSheetPage}
                  title={item.title}
                  footerIcon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.00032 10.666V13.3327H7.33366V10.666H13.3337V9.33268H7.33366L7.33366 6.66602H13.3337V5.33268H7.33366V2.66602H6.00033V5.33268H2.66699V6.66602H6.00033L6.00032 9.33268H2.66699V10.666H6.00032Z"
                        fill="#34C759"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.9048 2H9.09521C9.81773 1.99999 10.4005 1.99999 10.8724 2.03855C11.3583 2.07825 11.7851 2.16212 12.18 2.36331C12.8072 2.68289 13.3171 3.19283 13.6367 3.82003C13.8379 4.21489 13.9218 4.64169 13.9615 5.12758C14 5.5995 14 6.18226 14 6.90478V9.09522C14 9.81774 14 10.4005 13.9615 10.8724C13.9218 11.3583 13.8379 11.7851 13.6367 12.18C13.3171 12.8072 12.8072 13.3171 12.18 13.6367C11.7851 13.8379 11.3583 13.9218 10.8724 13.9615C10.4005 14 9.81774 14 9.09522 14H6.90478C6.18226 14 5.5995 14 5.12758 13.9615C4.64168 13.9218 4.21489 13.8379 3.82003 13.6367C3.19283 13.3171 2.68289 12.8072 2.36331 12.18C2.16212 11.7851 2.07825 11.3583 2.03855 10.8724C1.99999 10.4005 1.99999 9.81773 2 9.09521V6.9048C1.99999 6.18227 1.99999 5.5995 2.03855 5.12758C2.07825 4.64168 2.16212 4.21489 2.36331 3.82003C2.68289 3.19283 3.19283 2.68289 3.82003 2.36331C4.21489 2.16212 4.64169 2.07825 5.12758 2.03855C5.5995 1.99999 6.18227 1.99999 6.9048 2ZM5.23616 3.36745C4.83272 3.40041 4.60092 3.46186 4.42535 3.55132C4.04903 3.74307 3.74307 4.04903 3.55132 4.42535C3.46186 4.60092 3.40041 4.83272 3.36745 5.23616C3.33385 5.64739 3.33333 6.1756 3.33333 6.93333V9.06667C3.33333 9.8244 3.33385 10.3526 3.36745 10.7638C3.40041 11.1673 3.46186 11.3991 3.55132 11.5746C3.74307 11.951 4.04903 12.2569 4.42535 12.4487C4.60092 12.5381 4.83272 12.5996 5.23616 12.6326C5.64739 12.6661 6.1756 12.6667 6.93333 12.6667H9.06667C9.8244 12.6667 10.3526 12.6661 10.7638 12.6326C11.1673 12.5996 11.3991 12.5381 11.5746 12.4487C11.951 12.2569 12.2569 11.951 12.4487 11.5746C12.5381 11.3991 12.5996 11.1673 12.6326 10.7638C12.6661 10.3526 12.6667 9.82441 12.6667 9.06667V6.93333C12.6667 6.1756 12.6661 5.64739 12.6326 5.23616C12.5996 4.83272 12.5381 4.60092 12.4487 4.42535C12.2569 4.04903 11.951 3.74307 11.5746 3.55132C11.3991 3.46186 11.1673 3.40041 10.7638 3.36745C10.3526 3.33385 9.82441 3.33333 9.06667 3.33333H6.93333C6.1756 3.33333 5.64739 3.33385 5.23616 3.36745Z"
                        fill="#34C759"
                      />
                    </svg>
                  }
                  footerTitle="excel"
                  footerTime={item.postedAt}
                  footerOperation={
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="w-fit h-fit !p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}>
                        <Share2Icon className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-fit h-fit !p-0">
                            <EllipsisIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSheet(item)
                            }}>
                            <Trash2Icon className="text-red w-4 h-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  }
                />
              ))}
            </section>
          ) : (
            <EmptyContent content="No Sheet Now" />
          )}
          {/* load more */}
          <div ref={bottomObserver} className="h-4 w-full" />
          {isFetchingNextPage && <p className="text-center">loading...</p>}
        </main>
      )}
    </div>
  )
}
