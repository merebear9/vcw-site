import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
  renderMarkdown,
  splitHtmlAtParagraph,
  getReadTime,
} from "@/lib/articles";
import { canAccessArticle } from "@/lib/membership";
import { formatDate, siteUrl, isSvgPath } from "@/lib/utils";
import CategoryBadge from "@/components/CategoryBadge";
import ShareButtons from "@/components/ShareButtons";
import ArticleCard from "@/components/ArticleCard";
import PDFViewer from "@/components/PDFViewer";
import PaywallOverlay from "@/components/PaywallOverlay";
import CommentSection from "@/components/CommentSection";
import ViewCounter from "@/components/ViewCounter";

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};

  const url = siteUrl(`/articles/${article.slug}`);
  const image = article.featuredImage ?? "/images/og-default.png";

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.author],
      images: [{ url: image, width: 1200, height: 675 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article || !article.published) notFound();

  const [hasAccess, related, contentHtml] = await Promise.all([
    canAccessArticle(article),
    getRelatedArticles(article),
    renderMarkdown(article.content),
  ]);

  const url = siteUrl(`/articles/${article.slug}`);
  const { preview, isTruncated } = hasAccess
    ? { preview: contentHtml, isTruncated: false }
    : splitHtmlAtParagraph(contentHtml, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage ? [siteUrl(article.featuredImage)] : undefined,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: [{ "@type": "Person", name: article.author }],
    publisher: {
      "@type": "Organization",
      name: "Vermilion County Watchdog",
      logo: { "@type": "ImageObject", url: siteUrl("/images/logo.png") },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <article className="mx-auto max-w-article px-4 py-10 sm:px-6">
      <ViewCounter slug={article.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CategoryBadge category={article.category} breaking={article.breaking} />
      <h1 className="heading-font mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-4 text-lg text-vcw-gray">{article.excerpt}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-vcw-border py-4">
        <div className="text-sm text-vcw-gray">
          <span className="font-semibold text-white">By {article.author}</span>
          <span className="mx-2">&middot;</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span className="mx-2">&middot;</span>
          <span>{getReadTime(article.content)}</span>
          <span className="mx-2">&middot;</span>
          <span>{article.viewCount.toLocaleString()} views</span>
        </div>
        <ShareButtons url={url} title={article.title} />
      </div>

      {article.featuredImage && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden bg-vcw-charcoal2">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 640px) 720px, 100vw"
            unoptimized={isSvgPath(article.featuredImage)}
            className="object-cover"
          />
        </div>
      )}

      <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: preview }} />

      {isTruncated && <PaywallOverlay />}

      {article.pdfUrl && (
        <div className="mt-10">
          <h2 className="heading-font mb-3 text-lg font-bold text-white">Source Document</h2>
          <PDFViewer url={article.pdfUrl} title={`${article.title} — Public Record`} />
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-16 border-t border-vcw-border pt-10">
          <h2 className="heading-font mb-6 text-xl font-bold text-white">Related Stories</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((r) => (
              <ArticleCard key={r.id} article={r} />
            ))}
          </div>
        </section>
      )}

      <CommentSection articleId={article.id} />

      <div className="mt-10 text-center">
        <Link href="/" className="text-sm text-vcw-gray underline hover:text-white">
          &larr; Back to all stories
        </Link>
      </div>
    </article>
  );
}
