import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevisionBadgeProps {
  statusText: string;
  isDue: boolean;
  className?: string;
  size?: "sm" | "default";
}

export function RevisionBadge({ statusText, isDue, className, size = "default" }: RevisionBadgeProps) {
  if (!statusText || statusText === "Not Solved Yet" || statusText === "Not Started") {
    return (
      <Badge variant="outline" className={cn("text-xs text-muted-foreground border-border/50", className)}>
        Not Solved
      </Badge>
    );
  }

  if (isDue) {
    return (
      <Badge
        variant="destructive"
        className={cn(
          "bg-rose-500/15 text-rose-400 border-rose-500/30 flex items-center gap-1 font-medium",
          size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5",
          className
        )}
      >
        <AlertTriangle className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
        {statusText}
      </Badge>
    );
  }

  if (statusText === "Due Tomorrow") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-amber-500/15 text-amber-400 border-amber-500/30 flex items-center gap-1 font-medium",
          size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5",
          className
        )}
      >
        <RotateCcw className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
        Due Tomorrow
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-primary/10 text-primary border-primary/20 flex items-center gap-1 font-normal",
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5",
        className
      )}
    >
      <Clock className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
      {statusText}
    </Badge>
  );
}
