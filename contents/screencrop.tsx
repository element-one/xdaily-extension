import cssText from "data-text:~/styles/global.css"
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from "plasmo"
import React, { useEffect, useRef, useState } from "react"
import { Layer, Rect, Stage } from "react-konva"

import { sendToBackground } from "@plasmohq/messaging"

import { MessageType } from "~types/message"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const SHADOW_HOST_ID = "xdaily-screencrop-cont"
export const getShadowHostId: PlasmoGetShadowHostId = () => SHADOW_HOST_ID

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const ScreenCropOverlay = () => {
  const stageRef = useRef(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionRect, setSelectionRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const dpr = window.devicePixelRatio || 1
  const scrollX = window.scrollX
  const scrollY = window.scrollY

  useEffect(() => {
    const messageListener = (message) => {
      if (message.type === MessageType.START_SCREENSHOT) {
        setShowOverlay(true)
      }
    }

    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [])

  const onMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition()
    if (!pos) return
    setStartPos(pos)
    setSelectionRect({ x: pos.x, y: pos.y, width: 0, height: 0 })
    setIsSelecting(true)
  }

  const onMouseMove = (e: any) => {
    if (!isSelecting) return
    const pos = e.target.getStage().getPointerPosition()
    if (!pos) return

    const newX = Math.min(pos.x, startPos.x)
    const newY = Math.min(pos.y, startPos.y)
    const newWidth = Math.abs(pos.x - startPos.x)
    const newHeight = Math.abs(pos.y - startPos.y)

    setSelectionRect({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    })
  }

  const onMouseUp = async () => {
    setIsSelecting(false)

    const rect = selectionRect
    if (rect.width < 10 || rect.height < 10) {
      return
    }

    setShowOverlay(false)
    await new Promise((res) => setTimeout(res, 100)) // 等一帧

    const res = await sendToBackground({
      name: "capture-screenshot"
    })

    if (res?.dataUrl) {
      const img = document.createElement("img")
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = selectionRect.width * dpr
        canvas.height = selectionRect.height * dpr
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.scale(dpr, dpr)
        const sx = (rect.x + scrollX) * dpr
        const sy = (rect.y + scrollY) * dpr
        const sWidth = rect.width * dpr
        const sHeight = rect.height * dpr

        ctx.drawImage(
          img,
          sx,
          sy,
          sWidth,
          sHeight,
          0,
          0,
          rect.width,
          rect.height
        )
        const croppedUrl = canvas.toDataURL()
        setScreenshotUrl(croppedUrl)
      }
      img.src = res.dataUrl
    }
  }

  return (
    <div>
      {showOverlay && (
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            cursor: "crosshair"
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}>
          <Layer>
            {/* 半透明蒙层 */}
            <Rect
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerHeight}
              fill="rgba(0,0,0,0.3)"
            />
            {/* 选区矩形 */}
            {isSelecting && (
              <Rect
                x={selectionRect.x}
                y={selectionRect.y}
                width={selectionRect.width}
                height={selectionRect.height}
                stroke="red"
                strokeWidth={2}
                dash={[4, 4]}
                fill="rgba(255,255,255,0.3)"
              />
            )}
          </Layer>
        </Stage>
      )}

      {/* 显示截图结果 */}
      {screenshotUrl && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            border: "2px solid #ddd",
            zIndex: 10000,
            backgroundColor: "white",
            padding: 8,
            maxWidth: 300
          }}>
          <h4>截图结果</h4>
          <img src={screenshotUrl} alt="screenshot" style={{ width: "100%" }} />
          <button onClick={() => setScreenshotUrl(null)}>关闭</button>
        </div>
      )}
    </div>
  )
}

export default ScreenCropOverlay
