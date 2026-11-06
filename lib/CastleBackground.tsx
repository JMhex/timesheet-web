// components/CastleBackground.tsx
"use client"

import { useEffect, useRef } from "react"
import { drawCastleScene, SCENE_H, SCENE_W } from "@/lib/pixel-scene"

export default function CastleBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = ref.current?.getContext("2d")
    if (!ctx) return

    // Redraw whenever the second changes, so the moon clock ticks on time
    let lastSecond = -1
    const tick = () => {
      const now = new Date()
      if (now.getSeconds() !== lastSecond) {
        lastSecond = now.getSeconds()
        drawCastleScene(ctx, now)
      }
    }
    tick()
    const id = setInterval(tick, 200)
    return () => clearInterval(id)
  }, [])

  return (
    <canvas
      ref={ref}
      width={SCENE_W}
      height={SCENE_H}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
      style={{ imageRendering: "pixelated" }}
    />
  )
}
