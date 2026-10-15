import { cn } from "./utils";

function Skeleton({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-[var(--hover-nav-bg)]", className)}
      style={{ backgroundColor: 'var(--hover-nav-bg)', ...style }}
      {...props}
    />
  );
}

export { Skeleton };
