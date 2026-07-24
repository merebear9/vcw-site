import { cn } from "@/lib/utils";

export default function CategoryBadge({
  category,
  breaking = false,
  className,
}: {
  category: string;
  breaking?: boolean;
  className?: string;
}) {
  if (breaking) {
    return (
      <span className={cn("category-badge animate-pulse bg-vcw-red", className)}>
        Breaking
      </span>
    );
  }
  return <span className={cn("category-badge", className)}>{category}</span>;
}
