import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 rounded-md border-2 border-border bg-white px-4 py-3 text-lg transition-all outline-none placeholder:text-muted-foreground hover:border-[#A1A1AA] focus:border-[3px] focus:border-primary focus:ring-4 focus:ring-primary/25 disabled:cursor-not-allowed disabled:border-border disabled:bg-[#F9FAFB] disabled:opacity-50 aria-invalid:border-[3px] aria-invalid:border-destructive aria-invalid:bg-[#FFF5F5] aria-invalid:ring-4 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
