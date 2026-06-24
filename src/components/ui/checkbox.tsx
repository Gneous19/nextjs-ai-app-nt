"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "size-6 shrink-0 cursor-pointer appearance-none rounded-sm border-[3px] border-border bg-white transition-all outline-none checked:border-secondary checked:bg-secondary focus-visible:ring-4 focus-visible:ring-secondary/25 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function CheckboxWithLabel({
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
      <Checkbox {...props} />
      {children}
    </label>
  )
}

export { Checkbox, CheckboxWithLabel }
