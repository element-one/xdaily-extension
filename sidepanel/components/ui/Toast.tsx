import * as Toast from "@radix-ui/react-toast"
import clsx from "clsx"
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode
} from "react"

type ToastProps = {
  title: string
  description?: string
  duration?: number
  type?: "success" | "error" | "info"
}

type ToastContextValue = {
  showToast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [toastContent, setToastContent] = useState<ToastProps>({
    title: "",
    description: "",
    duration: 3000
  })
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  )

  const showToast = useCallback((props: ToastProps) => {
    setToastContent({ duration: 3000, ...props })
    setOpen(false)
    setTimeout(() => setOpen(true), 10)
    setToastType(props.type ?? "info")
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right" duration={toastContent.duration}>
        {children}
        <Toast.Root
          className={clsx(
            "border border-fill-bg-input text-text-default-primary rounded-lg px-4 py-2",
            toastType === "success" && "bg-green",
            toastType === "error" && "bg-red",
            toastType === "info" && "bg-fill-bg-light"
          )}
          open={open}
          onOpenChange={setOpen}>
          {toastContent.title && (
            <Toast.Title className="font-bold text-sm">
              {toastContent.title}
            </Toast.Title>
          )}
          {toastContent.description && (
            <Toast.Description className="text-xs mt-1 text-fill-text-light">
              {toastContent.description}
            </Toast.Description>
          )}
        </Toast.Root>
        <Toast.Viewport className="fixed top-4 right-4 w-2/3 z-[1000]" />
      </Toast.Provider>
    </ToastContext.Provider>
  )
}
