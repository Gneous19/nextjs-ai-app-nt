"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Radio({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type="radio"
      data-slot="radio"
      className={cn(
        "size-6 shrink-0 cursor-pointer appearance-none rounded-full border-[3px] border-border bg-white transition-all outline-none checked:border-secondary checked:shadow-[inset_0_0_0_4px_#fff,inset_0_0_0_12px_#4ECDC4] focus-visible:ring-4 focus-visible:ring-secondary/25 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function RadioWithLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"input"> & { children?: React.ReactNode }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-[10px] text-lg select-none",
        className
      )}
    >
      <Radio {...props} />
      {children}
    </label>
  )
}

export { Radio, RadioWithLabel }
