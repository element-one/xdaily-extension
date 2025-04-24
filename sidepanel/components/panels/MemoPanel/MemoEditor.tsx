import { useEffect, type FC } from "react"

import type { MemoItem } from "~types/memo"

import "@blocknote/core/fonts/inter.css"

import { BlockNoteView } from "@blocknote/mantine"

import "@blocknote/mantine/style.css"

import { useCreateBlockNote } from "@blocknote/react"

interface MemoEditorProps {
  memo: MemoItem
}
export const MemoEditor: FC<MemoEditorProps> = ({ memo }) => {
  const editor = useCreateBlockNote()

  useEffect(() => {
    // editor.setDocument(memo.content)
    if (!editor) return
    editor?.replaceBlocks(editor.document, memo.content?.document ?? [])
  }, [memo, editor])

  const debouncedHandleUpdateMemo = () => {}
  return (
    <div className="w-full flex-1 min-h-0 overflow-y-auto stylized-scroll">
      <BlockNoteView
        editor={editor}
        className="flex-1 min-h-0 m-4"
        theme="light"
        onChange={debouncedHandleUpdateMemo}
      />
    </div>
  )
}
