import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import type { Article } from "@prisma/client";
import { formatDate, isSvgPath } from "@/lib/utils";
import { getReadTime } from "@/lib/articles";
import CategoryBadge from "./CategoryBadge";

export default function ArticleCard({
  article,
  size = "default",
}: {
  article: Article;
  size?: "default" | "large";
}) {
  const isMembersOnly = article.accessLevel === "members_only";

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="card group flex flex-col overflow-hidden transition-colors hover:border-vcw-red"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-vcw-charcoal2">
        {article.featuredImage && (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            unoptimized={isSvgPath(article.featuredImage)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {isMembersOnly && (
          <div className="absolute right-2 top-2 flex items-center gap-1 bg-vcw-black/80 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-vcw-red">
            <Lock size={12} /> Members
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <CategoryBadge category={article.category} breaking={article.breaking} />
        </div>
        <h3
          className={`heading-font font-bold text-white group-hover:text-vcw-red ${
            size === "large" ? "text-2xl sm:text-3xl" : "text-lg"
          }`}
        >
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-vcw-gray">{article.excerpt}</p>
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs uppercase tracking-wide text-vcw-gray">
          <span>{formatDate(article.publishedAt)}</span>
          <span aria-hidden>&middot;</span>
          <span>{getReadTime(article.content)}</span>
        </div>
      </div>
    </Link>
  );
}
