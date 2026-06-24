import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Flip7SectionTitleProps = {
  emoji: string
  title: string
  className?: string
  children?: ReactNode
}

export function Flip7SectionTitle({
  emoji,
  title,
  className,
  children,
}: Flip7SectionTitleProps) {
  return (
    <div className={cn("flip7-section-title", className)}>
      <span className="flip7-section-title__emoji" role="img" aria-label={title}>
        {emoji}
      </span>
      <span className={cn("flip7-section-title__text", "flip7-h3")}>
        {title}
      </span>
      {children && (
        <span className="ml-auto">{children}</span>
      )}
    </div>
  )
}
