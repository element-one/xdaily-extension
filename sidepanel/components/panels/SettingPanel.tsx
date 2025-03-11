import * as Switch from "@radix-ui/react-switch"
import clsx from "clsx"
import { XIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { useStore } from "~store/store"

export const SettingPanel = () => {
  const {
    isHideGlobally,
    onHideGloballyChange,
    disableSite,
    removeFromDisableSite,
    addDisableSite
  } = useStore()

  const [inputText, setInputText] = useState("")

  const showGlobally = useMemo(() => {
    return !isHideGlobally
  }, [isHideGlobally])

  const handleWidgetGlobalMode = (checked: boolean) => {
    onHideGloballyChange(!checked)
  }

  const removeFromSite = (site: string) => {
    removeFromDisableSite(site)
  }

  // const handleInputChange = (site: string) => {
  //   setInputText(site.trim())
  // }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputText) return
    if (event.key === "Enter") {
      addSite()
    }
  }

  const addSite = () => {
    if (inputText?.length > 0) {
      addDisableSite(inputText)
      setInputText("")
      setTimeout(() => {
        setInputText("")
      }, 0)
    }
  }

  return (
    <div className="mt-0 pt-0 pb-3 flex flex-col justify-between bg-white rounded-md h-full">
      <header className="flex-none">
        <h1 className="text-base font-semibold flex gap-2 w-fit ">Settings</h1>
        <div className="pt-2 pb-1 border-b-[1.4px]" />
      </header>
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pb-3 hide-scrollbar">
        <section className="mt-2 text-base">
          <div className="mt-2">
            <h2 className="text-sm font-medium">Widget icons</h2>
            <div className="mt-2 flex gap-3 items-center justify-between">
              <label
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground font-normal"
                htmlFor="widgetGlobalMode">
                Always show widget icons on page
              </label>
              <Switch.Root
                checked={showGlobally}
                onCheckedChange={handleWidgetGlobalMode}
                className={clsx(
                  "w-11 h-6  rounded-3xl relative transition-colors",
                  showGlobally ? "bg-primary-brand" : "bg-slate-200"
                )}
                id="widgetGlobalMode">
                <Switch.Thumb
                  className={clsx(
                    "block size-4 bg-white rounded-3xl transition-all",
                    showGlobally ? "translate-x-[25px]" : "translate-x-[4px]"
                  )}
                />
              </Switch.Root>
            </div>
          </div>
          {disableSite?.length > 0 && (
            <div className="mt-3">
              <h2 className="text-sm font-medium">Disable on sites</h2>
              <div className="mt-2 flex gap-2 flex-wrap">
                {disableSite.map((site, index) => (
                  <div
                    key={index}
                    onClick={() => removeFromSite(site)}
                    className="cursor-pointer w-fit py-1 px-2 rounded-3xl bg-slate-200/80 flex items-center justify-center gap-x-1 text-sm">
                    <span>{site}</span>
                    <XIcon className="size-3 text-red-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-3">
            <h2 className="text-sm font-medium">Add a domain</h2>
            <div className="mt-2 flex gap-1 items-center justify-between">
              <input
                type="text"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                value={inputText}
                className="flex-1 min-w-0 h-8 outline-none border-2 border-primary-brand rounded-md px-1 text-sm"
              />
              <button
                className={clsx(
                  "outline-none bg-primary-brand text-white px-2 py-1 rounded-md h-8",
                  inputText.length === 0 && "opacity-50 cursor-not-allowed"
                )}
                onClick={addSite}>
                Add
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
