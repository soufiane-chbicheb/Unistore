import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, children, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-sm font-bold text-gray-700 ml-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {children && (
            <div className="absolute left-3 flex items-center pointer-events-none">
              {children}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-base ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-sm",
              children && "pl-10",
              error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs font-medium text-gray-400 ml-1">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
