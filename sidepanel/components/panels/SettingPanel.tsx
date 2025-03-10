import * as Switch from "@radix-ui/react-switch"
import clsx from "clsx"
import { useMemo } from "react"

import { useStore } from "~store/store"

export const SettingPanel = () => {
  const { isHideGlobally, onHideGloballyChange } = useStore()

  const showGlobally = useMemo(() => {
    return !isHideGlobally
  }, [isHideGlobally])

  const handleWidgetGlobalMode = (checked: boolean) => {
    onHideGloballyChange(!checked)
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
        </section>
      </main>
    </div>
  )
}
