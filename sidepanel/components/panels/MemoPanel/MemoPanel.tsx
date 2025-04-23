import { NotebookTextIcon } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"

import { useMemoList } from "~services/memo"
import type { MemoItem } from "~types/memo"

export const MemoPanel = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMemoList(15)
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

  const memos = useMemo(() => {
    return data?.pages ? data.pages : []
  }, [data])

  const handleCreateMemo = () => {
    chrome.tabs.create({
      url: `${process.env.PLASMO_PUBLIC_MAIN_SITE}/memo`
    })
  }

  const handleSelectMemo = (memo: MemoItem) => {}

  return (
    <div className="mt-0 pt-0 pb-3 flex flex-col justify-between bg-white rounded-md h-full">
      <header className="flex-none">
        <h1 className="text-base font-semibold flex gap-2 w-fit ">Memo</h1>
        <div className="pt-2 pb-1 border-b-[1.4px]" />
      </header>
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pb-3 hide-scrollbar pt-4">
        {memos?.length > 0 ? (
          <section className="flex flex-col gap-2 py-2 flex-1 overflow-y-scroll stylized-scroll">
            {memos.map((memo) => (
              <div
                onClick={() => handleSelectMemo(memo)}
                key={memo.id}
                className="flex items-center gap-2 cursor-pointer border border-slate-200 p-2 transition-all hover:border-primary-brand rounded-md">
                <NotebookTextIcon className="w-6 h-6 text-primary-brand" />
                <span>{memo.title}</span>
              </div>
            ))}
          </section>
        ) : (
          <div className="flex flex-col w-full h-full items-center justify-center gap-2">
            <div>Empty Memo</div>
            <button
              onClick={handleCreateMemo}
              className="items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-poppins bg-primary-brand text-white px-3 py-1 w-fit">
              Create
            </button>
          </div>
        )}
        {/* load more */}
        <div ref={bottomObserver} className="h-4 w-full" />
        {isFetchingNextPage && <p className="text-center">loading...</p>}
      </main>
    </div>
  )
}
