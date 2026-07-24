import Image from "next/image";
import Link from "next/link";
import { getPublishedArticles, getMostReadArticles } from "@/lib/articles";
import { formatDate, isSvgPath } from "@/lib/utils";
import ArticleCard from "@/components/ArticleCard";
import CategoryBadge from "@/components/CategoryBadge";
import BreakingBanner from "@/components/BreakingBanner";
import SupportCTA from "@/components/SupportCTA";
import NewsletterForm from "@/components/NewsletterForm";

export const revalidate = 60;

export default async function HomePage() {
  const articles = await getPublishedArticles();
  const mostRead = await getMostReadArticles(5);

  const breakingArticle = articles.find((a) => a.breaking);
  const hero = breakingArticle ?? articles[0];
  const rest = articles.filter((a) => a.id !== hero?.id).slice(0, 6);

  return (
    <div>
      {breakingArticle && <BreakingBanner article={breakingArticle} />}

      {hero && (
        <section className="border-b border-vcw-border">
          <Link href={`/articles/${hero.slug}`} className="group block">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-vcw-charcoal2 sm:aspect-[21/9]">
              {hero.featuredImage && (
                <Image
                  src={hero.featuredImage}
                  alt={hero.title}
                  fill
                  priority
                  sizes="100vw"
                  unoptimized={isSvgPath(hero.featuredImage)}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-vcw-black via-vcw-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6">
                <CategoryBadge category={hero.category} breaking={hero.breaking} />
                <h1 className="heading-font mt-3 max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">
                  {hero.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">{hero.excerpt}</p>
                <p className="heading-font mt-3 text-xs tracking-widest text-vcw-gray">
                  {formatDate(hero.publishedAt)} &middot; By {hero.author}
                </p>
              </div>
            </div>
          </Link>
        </section>
      )}

      <SupportCTA />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="section-title mb-6">Latest Stories</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          <aside>
            <h2 className="section-title mb-6">Most Read This Week</h2>
            <ol className="space-y-5">
              {mostRead.map((article, i) => (
                <li key={article.id}>
                  <Link href={`/articles/${article.slug}`} className="group flex gap-4">
                    <span className="heading-font text-3xl font-black text-vcw-red/60 group-hover:text-vcw-red">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="heading-font text-sm font-bold leading-snug text-white group-hover:text-vcw-red">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-wide text-vcw-gray">
                        {article.viewCount.toLocaleString()} views
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="card mt-10 p-6">
              <h3 className="heading-font text-lg font-bold text-white">Never Miss a Story</h3>
              <p className="mt-2 text-sm text-vcw-gray">
                Get our investigations delivered straight to your inbox. Free, always.
              </p>
              <NewsletterForm className="mt-4 !flex-col" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
