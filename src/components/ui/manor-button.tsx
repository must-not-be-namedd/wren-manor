import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const manorButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium font-manor transition-manor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-gradient-blood text-primary-foreground shadow-blood hover:shadow-lg hover:scale-105",
        secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 hover:shadow-manor",
        ghost: "text-foreground hover:bg-accent/20 hover:text-accent-foreground",
        candlelight: "bg-gradient-candlelight text-accent-foreground shadow-candlelight hover:shadow-lg hover:scale-105",
        outline: "border border-primary text-primary hover:bg-primary/10 hover:shadow-blood",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-14 rounded-xl px-12 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ManorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof manorButtonVariants> {}

const ManorButton = React.forwardRef<HTMLButtonElement, ManorButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(manorButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ManorButton.displayName = "ManorButton";

export { ManorButton, manorButtonVariants };