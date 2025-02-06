import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zinc-900/20 dark:bg-zinc-50/12",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
