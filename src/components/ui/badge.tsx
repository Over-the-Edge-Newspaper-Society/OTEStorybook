import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'primary' | 'warning' | 'danger'
  size?: 'default' | 'sm'
}

function Badge({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-950",
        {
          default: "border-transparent bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-900/90 dark:hover:bg-gray-200", // Neutral pill
          secondary: "border border-gray-200 dark:border-border bg-gray-50 text-gray-900 dark:bg-muted dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted/80",
          destructive: "border-transparent bg-red-600 text-white hover:bg-red-600/90",
          outline: "border border-gray-200 dark:border-border text-gray-900 dark:text-foreground bg-transparent",
          success: "border-transparent bg-green-600 text-white hover:bg-green-600/90",
          primary: "border-transparent bg-purple-600 text-white hover:bg-purple-600/90",
          warning: "border-transparent bg-blue-600 text-white hover:bg-blue-600/90",
          danger: "border-transparent bg-red-600 text-white hover:bg-red-600/90",
        }[variant],
        {
          'default': "px-2.5 py-0.5 text-xs",
          'sm': "px-2 py-0.5 text-[10px]",
        }[size],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
