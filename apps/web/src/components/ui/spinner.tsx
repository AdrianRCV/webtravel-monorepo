import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "h-3 w-3 border-2",
        default: "h-4 w-4 border-2",
        lg: "h-6 w-6 border-[3px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label="Cargando"
      className={cn(spinnerVariants({ size, className }))}
      {...props}
    />
  )
)
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants }
