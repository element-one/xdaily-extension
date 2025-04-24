import { useEffect, type FC } from "react"

import type { MemoItem } from "~types/memo"

import "@blocknote/core/fonts/inter.css"

import { BlockNoteView } from "@blocknote/mantine"

import "@blocknote/mantine/style.css"

import { useCreateBlockNote } from "@blocknote/react"

import { useDebounce } from "~libs/debounce"
import { useUpdateMemo } from "~services/memo"

interface MemoEditorProps {
  memo: MemoItem
  onSave?: (updatedMemo: MemoItem) => void
}
export const MemoEditor: FC<MemoEditorProps> = ({ memo, onSave }) => {
  const { mutateAsync: updateMemo, isPending: isUpdatingMemo } = useUpdateMemo()
  const editor = useCreateBlockNote()

  useEffect(() => {
    // editor.setDocument(memo.content)
    if (!editor) return
    editor?.replaceBlocks(editor.document, memo.content?.document ?? [])
  }, [memo, editor])

  const handleUpdateMemo = async () => {
    const title =
      (editor?.document as any)?.[0]?.content?.[0]?.text ?? memo.title
    const content = editor?.document
    const id = memo.id
    try {
      const newMemo = await updateMemo({
        id,
        data: {
          title,
          content: {
            document: content
          }
        }
      })
      onSave?.(newMemo)
    } catch (e) {
      console.error(e)
    }
  }

  const debouncedHandleUpdateMemo = useDebounce(handleUpdateMemo, 3000)

  return (
    <div className="w-full flex-1 min-h-0 overflow-y-auto stylized-scroll relative">
      {isUpdatingMemo && (
        <div className="absolute right-0 top-0 z-50 flex items-center justify-center gap-1 px-3 py-1.5 transition-all">
          <div className="h-2 w-2 animate-pulse rounded-full  bg-primary-brand"></div>
          <span className="text-xs font-medium text-slate-600">Saving...</span>
        </div>
      )}
      <BlockNoteView
        editor={editor}
        className="flex-1 min-h-0 m-4"
        theme="light"
        onChange={debouncedHandleUpdateMemo}
      />
    </div>
  )
}
