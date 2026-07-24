import Link from "next/link";
import type { Article } from "@prisma/client";

export default function BreakingBanner({ article }: { article: Article }) {
  return (
    <div className="border-b border-vcw-border bg-vcw-red">
      <Link
        href={`/articles/${article.slug}`}
        className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 text-sm text-white sm:px-6"
      >
        <span className="heading-font shrink-0 rounded-none bg-vcw-black px-2 py-0.5 text-xs font-bold tracking-widest">
          Breaking
        </span>
        <span className="truncate font-semibold">{article.title}</span>
      </Link>
    </div>
  );
}
