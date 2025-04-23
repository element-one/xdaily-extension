import { useEffect, type FC } from "react"

import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"

import type { MemoItem } from "~types/memo"

interface MemoEditorProps {
  memo: MemoItem
}
export const MemoEditor: FC<MemoEditorProps> = ({ memo }) => {
  return <div>{memo.id}</div>
}
