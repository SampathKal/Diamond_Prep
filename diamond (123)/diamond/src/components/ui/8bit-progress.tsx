"use client"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva("relative w-full overflow-hidden bg-paper", {
  variants: {
    variant: {
      default: "border-2 border-foreground",
      retro: "border-[3px] border-foreground shadow-[4px_4px_0_var(--foreground)]",
    },
  },
  defaultVariants: { variant: "default" },
})

export interface ProgressProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof progressVariants> {
  value?: number
  /** Tailwind class for the filled bar, e.g. "bg-primary" */
  progressBg?: string
}

/** Blocky 8-bit style progress bar made of discrete segments. */
export function Progress({ className, variant, value = 0, progressBg = "bg-primary", ...props }: ProgressProps) {
  const v = Math.max(0, Math.min(100, value))
  const segments = 20
  const filled = Math.round((v / 100) * segments)
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      className={cn(progressVariants({ variant }), className)}
      {...props}
    >
      <div className="flex h-full w-full gap-[2px] p-[2px]">
        {Array.from({ length: segments }, (_, i) => (
          <div key={i} className={cn("h-full flex-1 transition-colors duration-150", i < filled ? progressBg : "bg-transparent")} />
        ))}
      </div>
    </div>
  )
}
