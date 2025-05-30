import type { PartialBlock } from "@blocknote/core"
import { CopyPlusIcon, SaveIcon } from "lucide-react"
import { useMemo, type FC, type ReactNode } from "react"

import { extractAllTextWithLineBreaks } from "~libs/memo"
import { useCreateMemo, useMemoList, useUpdateMemo } from "~services/memo"
import { Button } from "~sidepanel/components/ui/Button"
import { useToast } from "~sidepanel/components/ui/Toast"
import { Tooltip } from "~sidepanel/components/ui/Tooltip"
import type {
  ErrorMessageData,
  MemoMessageData,
  SheetMessageData
} from "~types/chat"

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
  return (
    <BasicRenderer
      title={data.title}
      actions={
        <>
          <Tooltip content="Save as new sheet">
            <Button variant="ghost" className="!p-0">
              <SaveIcon className="w-4 h-4 text-primary-brand" />
            </Button>
          </Tooltip>
          <Tooltip content="Append to latest sheet">
            <Button variant="ghost" className="!p-0">
              <CopyPlusIcon className="w-4 h-4 text-white" />
            </Button>
          </Tooltip>
        </>
      }>
      This is a sheet
    </BasicRenderer>
  )
}

export const ReminderMessageRenderer: FC = () => {
  return (
    <BasicRenderer
      title="Reminder"
      actions={
        <>
          <Tooltip content="Save as new reminder">
            <Button variant="ghost" className="!p-0">
              <SaveIcon className="w-4 h-4 text-primary-brand" />
            </Button>
          </Tooltip>
          <Tooltip content="Append to latest reminder">
            <Button variant="ghost" className="!p-0">
              <CopyPlusIcon className="w-4 h-4 text-white" />
            </Button>
          </Tooltip>
        </>
      }>
      This is a reminder
    </BasicRenderer>
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
