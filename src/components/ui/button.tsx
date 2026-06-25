import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-4xl font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/25 focus-visible:shadow-coral active:scale-95 disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-coral hover:bg-nomad-sand-hover",
        secondary:
          "bg-secondary text-secondary-foreground shadow-teal hover:bg-nomad-ocean-hover",
        ghost:
          "border-[3px] border-primary bg-transparent text-primary hover:bg-primary/15",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[#DC2626]",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        sm: "h-10 gap-1.5 px-5 text-base min-w-[44px]",
        default: "h-12 gap-1.5 px-7 text-lg min-w-[44px]",
        lg: "h-14 gap-2 px-9 text-[22px] min-w-[44px]",
        icon: "size-12",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
