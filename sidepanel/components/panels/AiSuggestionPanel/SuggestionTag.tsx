import clsx from "clsx"
import { useMemo, type FC } from "react"

interface SuggestionTagProps {
  name: string
  addable?: boolean
  deletable?: boolean
  onTagClick?: () => void
}
export const SuggestionTag: FC<SuggestionTagProps> = ({
  name,
  addable = true,
  deletable = false,
  onTagClick
}) => {
  const canDelete = useMemo(() => {
    return !addable && deletable
  }, [addable, deletable])

  const handleClick = () => {
    if (addable || deletable) {
      onTagClick?.()
    }
  }
  return (
    <div
      className={clsx(
        "border-thinborder flex h-fit w-fit  items-center gap-2 whitespace-nowrap rounded-md border-2 py-1 px-2",
        addable && "bg-green-100 border-dashed",
        deletable && "bg-gray-200",
        (addable || deletable) && "cursor-pointer"
      )}
      onClick={() => handleClick()}>
      <div className="text-xs">{name}</div>
      {canDelete && <div className="text-xs">x</div>}
    </div>
  )
}
