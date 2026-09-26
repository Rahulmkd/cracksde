import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium tracking-wide transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 select-none",
  {
    variants: {
      variant: {
        default:
          "border-zinc-800 bg-zinc-900 text-zinc-300",
        blue:
          "border-blue-500/30 bg-blue-500/10 text-blue-400",
        brand:
          "border-blue-500/30 bg-blue-500/10 text-blue-400",
        secondary:
          "border-zinc-800/80 bg-zinc-900/60 text-zinc-400",
        success:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        warning:
          "border-amber-500/30 bg-amber-500/10 text-amber-400",
        destructive:
          "border-red-500/30 bg-red-500/10 text-red-400",
        purple:
          "border-purple-500/30 bg-purple-500/10 text-purple-400",
        cyan:
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
        outline:
          "border-zinc-800 text-zinc-400 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
