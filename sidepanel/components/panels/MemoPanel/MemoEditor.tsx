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
  return (
    <div className="w-full flex-1 min-h-0 overflow-y-auto stylized-scroll">
      {memo.id}
      <BlockNoteView editor={editor} />
    </div>
  )
}
