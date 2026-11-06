// components/Wizard.tsx
"use client"

import { useEffect, useRef } from "react"
import { startWizard, WIZ_H, WIZ_W } from "@/lib/pixel-scene"

export default function Wizard({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = ref.current?.getContext("2d")
    if (!ctx) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    return startWizard(ctx, reduced) // returns a cleanup that stops the animation
  }, [])

  return (
    <canvas
      ref={ref}
      width={WIZ_W}
      height={WIZ_H}
      aria-hidden
      // 3x scale: 48x72 pixels -> 144x216 on screen
      className={`pointer-events-none h-[216px] w-[144px] ${className}`}
      style={{ imageRendering: "pixelated" }}
    />
  )
}
