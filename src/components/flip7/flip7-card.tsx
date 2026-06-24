import type { ReactNode, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Flip7CardVariant = "default" | "highlighted" | "boom"

type Flip7CardProps = {
  variant?: Flip7CardVariant
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

const variantClass: Record<Flip7CardVariant, string> = {
  default: "",
  highlighted: "flip7-card--highlighted",
  boom: "flip7-card--boom",
}

export function Flip7Card({
  variant = "default",
  className,
  children,
  ...props
}: Flip7CardProps) {
  return (
    <div
      className={cn("flip7-card", variantClass[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
}
