import React, { useEffect, useRef, useState, type FC } from "react"

export const ResponsiveColumns: FC<{
  classNames?: string
  children: React.ReactNode
}> = ({ children, classNames = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columnsClass, setColumnsClass] = useState("columns-2")

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return

      const width = containerRef.current.clientWidth

      if (width > 500) {
        setColumnsClass("columns-5")
      } else if (width > 450) {
        setColumnsClass("columns-4")
      } else if (width > 380) {
        setColumnsClass("columns-3")
      } else {
        setColumnsClass("columns-2")
      }
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)

    return () => {
      window.removeEventListener("resize", updateColumns)
    }
  }, [])

  return (
    <main
      ref={containerRef}
      className={`${columnsClass} gap-2 space-y-2 ${classNames}`}>
      {children}
    </main>
  )
}
