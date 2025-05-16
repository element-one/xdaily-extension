import { ChevronLeftIcon, PlusIcon, SearchIcon, Share2Icon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { useCreateMemo, useMemoList } from "~services/memo"
import { Button } from "~sidepanel/components/ui/Button"
import { Card } from "~sidepanel/components/ui/Card"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import type { MemoItem } from "~types/memo"

import { MemoEditor } from "./MemoEditor"

export const MemoPanel = () => {
  const [selectedMemo, setSelectedMemo] = useState<MemoItem | null>(null)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    updateMemoList,
    refetch
  } = useMemoList(15)
  const bottomObserver = useRef<HTMLDivElement>(null)

  const { mutateAsync: createMemo, isPending: isCreatingMemo } = useCreateMemo()

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

  const memos = useMemo(() => {
    return data?.pages ? data.pages : []
  }, [data])

  const handleCreateMemo = async () => {
    if (isCreatingMemo) return
    await createMemo({
      title: "untitled",
      content: {
        document: []
      }
    })
    refetch()
  }

  const handleSelectMemo = (memo: MemoItem) => {
    setSelectedMemo(memo)
  }
  const handleCloseMemo = () => {
    setSelectedMemo(null)
  }

  const handleMemoUpdate = (newMemo: MemoItem) => {
    setSelectedMemo(newMemo)

    if (!data) return
    updateMemoList(newMemo)
  }

  return (
    <div className="flex flex-col h-full">
      {selectedMemo ? (
        <PanelHeader
          title={
            <>
              <ChevronLeftIcon
                className="w-5 h-5 cursor-pointer"
                onClick={handleCloseMemo}
              />{" "}
              Memo
            </>
          }
        />
      ) : (
        <PanelHeader
          title="Memo"
          rightContent={
            <div className="flex items-center gap-x-2">
              <button className="w-5 h-5 flex items-center justify-center focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50">
                <SearchIcon className="w-5 h-5 text-text-default-regular" />
              </button>
              <Button
                variant="ghost"
                isDisabled={isCreatingMemo}
                className="p-0"
                onClick={handleCreateMemo}>
                <div className="text-primary-brand border-[2px] rounded-md border-primary-brand w-4 h-4 flex items-center justify-center">
                  <PlusIcon className="w-4 h-4" strokeWidth={4} />
                </div>
              </Button>
            </div>
          }
        />
      )}
      {selectedMemo ? (
        <MemoEditor memo={selectedMemo} onSave={handleMemoUpdate} />
      ) : (
        <main className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden py-4 hide-scrollbar">
          {memos?.length > 0 ? (
            <section className="flex flex-col gap-4 py-2 flex-1 overflow-y-scroll stylized-scroll">
              {memos.map((memo) => (
                <Card
                  key={memo.id}
                  title={memo.title}
                  content={
                    (memo.content.document ?? [])?.[0]?.content?.[0]?.text ?? ""
                  }
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
                        d="M8.6665 2.66736H6.53317C5.96212 2.66736 5.57392 2.66788 5.27386 2.69239C4.98159 2.71627 4.83212 2.75956 4.72785 2.81268C4.47697 2.94052 4.27299 3.14449 4.14516 3.39537C4.09204 3.49964 4.04875 3.64911 4.02487 3.94138C4.00036 4.24144 3.99984 4.62964 3.99984 5.20069V10.8007C3.99984 11.3717 4.00036 11.7599 4.02487 12.06C4.04875 12.3523 4.09204 12.5017 4.14516 12.606C4.27299 12.8569 4.47697 13.0609 4.72785 13.1887C4.83212 13.2418 4.98159 13.2851 5.27386 13.309C5.57392 13.3335 5.96212 13.334 6.53317 13.334H7.99984C8.36803 13.334 8.6665 13.6325 8.6665 14.0007C8.6665 14.3689 8.36803 14.6674 7.99984 14.6674H6.50562C5.96898 14.6674 5.52608 14.6674 5.16529 14.6379C4.79056 14.6073 4.44609 14.5416 4.12253 14.3767C3.62076 14.121 3.21282 13.7131 2.95715 13.2113C2.79229 12.8878 2.72658 12.5433 2.69597 12.1686C2.66649 11.8078 2.6665 11.3649 2.6665 10.8282V5.17316C2.6665 4.63652 2.66649 4.1936 2.69597 3.83281C2.72658 3.45808 2.79229 3.11361 2.95715 2.79005C3.21282 2.28829 3.62076 1.88034 4.12253 1.62468C4.44609 1.45982 4.79056 1.39411 5.16529 1.36349C5.52608 1.33401 5.96899 1.33402 6.50564 1.33403L8.74228 1.334C9.16561 1.3338 9.48547 1.33365 9.79393 1.40771C10.066 1.47303 10.3261 1.58078 10.5647 1.72699C10.8352 1.89274 11.0613 2.11902 11.3605 2.4185L12.2487 3.30671C12.5482 3.6059 12.7745 3.83198 12.9402 4.10246C13.0864 4.34105 13.1942 4.60117 13.2595 4.87327C13.3335 5.18172 13.3334 5.50158 13.3332 5.92491L13.3332 8.00069C13.3332 8.36888 13.0347 8.66736 12.6665 8.66736C12.2983 8.66736 11.9998 8.36888 11.9998 8.00069V6.00069H10.6665C9.56193 6.00069 8.6665 5.10526 8.6665 4.00069V2.66736ZM11.7065 4.66736C11.6264 4.57262 11.4984 4.44209 11.2578 4.20151L10.4657 3.40936C10.2251 3.16877 10.0946 3.04082 9.99984 2.96071V4.00069C9.99984 4.36888 10.2983 4.66736 10.6665 4.66736H11.7065Z"
                        fill="#FFE600"
                      />
                      <path
                        d="M10.6161 12.7875L10.0252 14.2048C9.91059 14.4796 10.1863 14.7553 10.4611 14.6408L11.8785 14.0499C11.9588 14.0164 12.0318 13.9675 12.0934 13.9059L14.4687 11.5305C14.7291 11.2702 14.7291 10.848 14.4687 10.5877L14.0782 10.1972C13.8179 9.93687 13.3958 9.93687 13.1354 10.1972L10.76 12.5726C10.6985 12.6342 10.6496 12.7071 10.6161 12.7875Z"
                        fill="#FFE600"
                      />
                    </svg>
                  }
                  footerTitle="Note"
                  footerTime={memo.postedAt}
                  footerOperation={
                    <Button variant="ghost" className="w-fit h-fit p-0">
                      <Share2Icon className="w-4 h-4" />
                    </Button>
                  }
                  onClick={() => handleSelectMemo(memo)}
                />
              ))}
            </section>
          ) : (
            <EmptyContent content="Empty Memo" />
          )}
          {/* load more */}
          <div ref={bottomObserver} className="h-4 w-full" />
          {isFetchingNextPage && <p className="text-center">loading...</p>}
        </main>
      )}
    </div>
  )
}
