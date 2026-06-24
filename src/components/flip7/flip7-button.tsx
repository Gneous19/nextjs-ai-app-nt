"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

type Flip7ButtonVariant =
  | "primary"
  | "counter-minus"
  | "counter-plus"
  | "boom"
  | "flip7"

type Flip7ButtonProps = {
  variant?: Flip7ButtonVariant
  full?: boolean
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">

const variantClass: Record<Flip7ButtonVariant, string> = {
  primary: "flip7-btn--primary",
  "counter-minus": "flip7-btn--counter-minus",
  "counter-plus": "flip7-btn--counter-plus",
  boom: "flip7-btn--boom",
  flip7: "flip7-btn--flip7",
}

export function Flip7Button({
  variant = "primary",
  full = false,
  className,
  children,
  ...props
}: Flip7ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flip7-btn",
        variantClass[variant],
        full && "flip7-btn--full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
