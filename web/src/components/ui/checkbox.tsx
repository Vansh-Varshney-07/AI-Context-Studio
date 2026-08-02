import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Checkbox = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, checked, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          checked={checked}
          {...props}
        />
        <div className={cn("absolute inset-0 flex items-center justify-center text-[var(--color-bg-primary)]", "peer-checked:block hidden")}>
          <Check className="h-3 w-3" aria-hidden="true" />
        </div>
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";