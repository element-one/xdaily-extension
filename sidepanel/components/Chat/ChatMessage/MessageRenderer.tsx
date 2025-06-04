import type { PartialBlock } from "@blocknote/core"
import { ClockIcon, CopyPlusIcon, SaveIcon } from "lucide-react"
import Markdown from "markdown-to-jsx"
import { useMemo, useState, type FC, type ReactNode } from "react"

import { normalizeMarkdownInput } from "~libs/chat"
import { extractAllTextWithLineBreaks } from "~libs/memo"
import { useCreateMemo, useMemoList, useUpdateMemo } from "~services/memo"
import { useCreateSheet, useSheetList, useUpdateSheet } from "~services/sheet"
import { ReminderDialog } from "~sidepanel/components/panels/ReminderPanel/ReminderDialog"
import { useToast } from "~sidepanel/components/ui/Toast"
import type {
  ErrorMessageData,
  MemoMessageData,
  ReminderMessageData,
  SheetMessageData
} from "~types/chat"
import type { DialogReminderItem, ReminderItem } from "~types/reminder"
import type { SparseFormat } from "~types/sheet"

import { ActionButton } from "./ActionButton"

const BasicRenderer: FC<{
  title?: string
  children: ReactNode
  actions?: ReactNode
}> = ({ title, children, actions }) => {
  return (
    <div className="bg-fill-bg-light rounded-xl border border-fill-bg-input p-3 w-full flex flex-col gap-2">
      <h3 className="font-semibold text-primary-brand line-clamp-2">{title}</h3>
      <div className="space-y-2">{children}</div>
      <div className="flex gap-2 items-center justify-end">{actions}</div>
    </div>
  )
}

export const MemoMessageRenderer: FC<{ data: MemoMessageData }> = ({
  data
}) => {
  const {
    mutateAsync: createMemo,
    isPending: isCreatingMemo,
    isSuccess: isCreatingSuccess
  } = useCreateMemo()
  const {
    mutateAsync: updateMemo,
    isPending: isUpdatingMemo,
    isSuccess: isUpdatingSuccess
  } = useUpdateMemo()
  const { showToast } = useToast()

  const { data: memoPages, refetch, isFetching } = useMemoList(1)

  const latestMemo = useMemo(() => {
    return (memoPages?.pages ?? [])[0]
  }, [memoPages])

  const handleCreateMemo = async (title: string, document: PartialBlock[]) => {
    if (isCreatingMemo) return
    try {
      await createMemo({
        title,
        content: {
          document
        }
      })
      refetch()
    } catch (e) {
      showToast({
        type: "error",
        title: "Error",
        description: "Something wrong, try later"
      })
    }
  }

  const handleAppendMemo = async (document: PartialBlock[]) => {
    if (!latestMemo) return

    try {
      await updateMemo({
        id: latestMemo.id,
        data: {
          title: latestMemo.title,
          content: {
            document: [...latestMemo.content?.document, ...document]
          }
        }
      })
    } catch (e) {
      showToast({
        type: "error",
        title: "Error",
        description: "Something wrong, try later"
      })
    }
  }
  return (
    <BasicRenderer
      title={data.title}
      actions={
        <>
          <ActionButton
            tooltip="Save as new memo"
            successTooltip="Create success"
            isLoading={isCreatingMemo}
            isDisabled={isCreatingMemo}
            isSuccess={isCreatingSuccess}
            onClick={() => handleCreateMemo(data.title, data.content)}
            icon={<SaveIcon className="w-4 h-4 text-primary-brand" />}
          />
          {latestMemo && (
            <ActionButton
              tooltip="Append to latest memo"
              successTooltip="Append success"
              isLoading={isUpdatingMemo}
              isDisabled={isUpdatingMemo || isFetching}
              isSuccess={isUpdatingSuccess}
              onClick={() => handleAppendMemo(data.content)}
              icon={<CopyPlusIcon className="w-4 h-4 text-white" />}
            />
          )}
        </>
      }>
      {extractAllTextWithLineBreaks(data.content)}
    </BasicRenderer>
  )
}

export const SheetMessageRenderer: FC<{ data: SheetMessageData }> = ({
  data
}) => {
  const HEADER_NAME = "content"
  const { showToast } = useToast()
  const { data: sheetPages, refetch, isFetching } = useSheetList(1)

  const latestSheet = useMemo(() => {
    return (sheetPages?.pages ?? [])[0]
  }, [sheetPages])

  const {
    mutateAsync: createSheet,
    isPending: isCreatingSheet,
    isSuccess: isCreatingSuccess
  } = useCreateSheet()
  const {
    mutateAsync: updateSheet,
    isPending: isUpdatingSheet,
    isSuccess: isUpdatingSuccess
  } = useUpdateSheet()

  const handleCreateSheet = async (title: string, content: string) => {
    try {
      const newSheet: SparseFormat = {
        uid: `+new Date()`,
        columns: [
          {
            title: HEADER_NAME,
            id: "content",
            index: 0
          }
        ],
        data: [
          {
            row_index: 0,
            column_index: 0,
            payload: {
              content: content,
              labels: []
            }
          }
        ]
      }
      await createSheet({
        title,
        content: {
          item: JSON.stringify(newSheet)
        }
      })
      refetch()
    } catch (e) {
      showToast({
        type: "error",
        title: "Error",
        description: "Something wrong, try later"
      })
    }
  }

  const handleAppendSheet = async (content: string) => {
    if (!latestSheet) return
    try {
      const raw = latestSheet.content.item
      const parsed = JSON.parse(raw)
      const isEmptyObject = raw.trim() === "{}"

      const sheet: SparseFormat = isEmptyObject
        ? {
            uid: latestSheet.id,
            columns: [],
            data: []
          }
        : parsed

      // make sure column
      let columnIndex: number
      const existing = sheet.columns.find((col) => col.title === HEADER_NAME)
      if (existing) {
        columnIndex = existing.index
      } else {
        columnIndex = sheet.columns.length
        sheet.columns.push({
          title: HEADER_NAME,
          id: "content",
          index: columnIndex
        })
      }

      // find empty row
      const nextRowIndex = getNextRowIndex(sheet, columnIndex)

      sheet.data.push({
        row_index: nextRowIndex,
        column_index: columnIndex,
        payload: {
          content,
          labels: []
        }
      })

      // updated item
      const updatedItem = JSON.stringify(sheet, null, 2)
      await updateSheet({
        id: latestSheet.id,
        data: {
          title: latestSheet.title,
          content: {
            item: updatedItem
          }
        }
      })
    } catch (err) {
      showToast({
        type: "error",
        title: "Error",
        description: "Something wrong, try later"
      })
    }

    function getNextRowIndex(sheet: SparseFormat, columnIndex: number): number {
      const rowsInColumn = sheet.data
        .filter((cell) => cell.column_index === columnIndex)
        .map((cell) => cell.row_index)

      return rowsInColumn.length > 0 ? Math.max(...rowsInColumn) + 1 : 0
    }
  }

  const content = normalizeMarkdownInput(data.content)
  return (
    <BasicRenderer
      title={data.title}
      actions={
        <>
          <ActionButton
            tooltip="Save as new sheet"
            successTooltip="Create success"
            isLoading={isCreatingSheet}
            isDisabled={isCreatingSheet}
            isSuccess={isCreatingSuccess}
            onClick={() => handleCreateSheet(data.title, content)}
            icon={<SaveIcon className="w-4 h-4 text-primary-brand" />}
          />
          {latestSheet && (
            <ActionButton
              tooltip="Append to latest sheet"
              successTooltip="Append success"
              isLoading={isUpdatingSheet}
              isDisabled={isUpdatingSheet || isFetching}
              isSuccess={isUpdatingSuccess}
              icon={<CopyPlusIcon className="w-4 h-4 text-white" />}
              onClick={() => handleAppendSheet(content)}
            />
          )}
        </>
      }>
      <Markdown className="prose prose-sm">{content}</Markdown>
    </BasicRenderer>
  )
}

export const ReminderMessageRenderer: FC<{ data: ReminderMessageData }> = ({
  data
}) => {
  const [isDialogOpen, onDialogChange] = useState(false)
  const [editingItem, setEditingItem] = useState<DialogReminderItem | null>(
    null
  )
  const [isSuccess, setIsSuccess] = useState(false)

  const desc = normalizeMarkdownInput(data.description)

  const handleCreateReminder = () => {
    setEditingItem({
      title: data.title,
      description: desc,
      fromAt: data.start_at,
      toAt: data.end_at
    })
    onDialogChange(true)
  }
  return (
    <>
      <BasicRenderer
        title={data.title}
        actions={
          <>
            <ActionButton
              tooltip="Create a reminder"
              successTooltip="Create success"
              isLoading={false}
              isDisabled={false}
              isSuccess={isSuccess}
              icon={<ClockIcon className="w-4 h-4 text-purple" />}
              onClick={handleCreateReminder}
            />
          </>
        }>
        <Markdown>{desc}</Markdown>
      </BasicRenderer>
      <ReminderDialog
        open={isDialogOpen}
        onOpenChange={onDialogChange}
        reminderItem={editingItem}
        onComplete={() => setIsSuccess(true)}
      />
    </>
  )
}

export const ErrorMessageRenderer: FC<{ errorData: ErrorMessageData }> = ({
  errorData
}) => {
  return (
    <div className="bg-[rgba(255,59,58,0.5)] rounded-xl px-3 py-1 w-full flex flex-col">
      <h3 className="text-colors-red font-semibold">Error</h3>
      <p className="text-sm">{errorData.error}</p>
    </div>
  )
}
