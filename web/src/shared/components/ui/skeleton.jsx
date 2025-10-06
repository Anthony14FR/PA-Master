import { cn } from "@/lib/utils"

function Skeleton({
  className,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props} />
  );
}

export { Skeleton }
