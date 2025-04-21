export const MemoPanel = () => {
  return (
    <div className="mt-0 pt-0 pb-3 flex flex-col justify-between bg-white rounded-md h-full">
      <header className="flex-none">
        <h1 className="text-base font-semibold flex gap-2 w-fit ">Memo</h1>
        <div className="pt-2 pb-1 border-b-[1.4px]" />
      </header>
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pb-3 hide-scrollbar pt-4">
        <div>Will be list of memo</div>
      </main>
    </div>
  )
}
