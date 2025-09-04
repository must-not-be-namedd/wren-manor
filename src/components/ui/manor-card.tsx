import * as React from "react";
import { cn } from "@/lib/utils";

const ManorCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-manor text-card-foreground transition-manor hover:shadow-lg hover:bg-card/90",
      className
    )}
    {...props}
  />
));
ManorCard.displayName = "ManorCard";

const ManorCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
));
ManorCardHeader.displayName = "ManorCardHeader";

const ManorCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-manor text-2xl font-semibold leading-none tracking-tight text-foreground", className)}
    {...props}
  />
));
ManorCardTitle.displayName = "ManorCardTitle";

const ManorCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground font-body leading-relaxed", className)}
    {...props}
  />
));
ManorCardDescription.displayName = "ManorCardDescription";

const ManorCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-2", className)} {...props} />
));
ManorCardContent.displayName = "ManorCardContent";

const ManorCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-2", className)}
    {...props}
  />
));
ManorCardFooter.displayName = "ManorCardFooter";

export { ManorCard, ManorCardHeader, ManorCardFooter, ManorCardTitle, ManorCardDescription, ManorCardContent };