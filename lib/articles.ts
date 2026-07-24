import { remark } from "remark";
import remarkHtml from "remark-html";
import readingTime from "reading-time";
import { prisma } from "@/lib/prisma";
import type { Article } from "@prisma/client";

export type ArticleAccessLevel = "free" | "members_only";

export function isMembersOnly(article: Pick<Article, "accessLevel">) {
  return article.accessLevel === "members_only";
}

export function getReadTime(content: string) {
  return readingTime(content).text;
}

export async function renderMarkdown(content: string) {
  const processed = await remark().use(remarkHtml).process(content);
  return processed.toString();
}

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getMostReadArticles(limit = 5) {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { viewCount: "desc" },
    take: limit,
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({ where: { slug } });
}

export async function getRelatedArticles(article: Article, limit = 3) {
  return prisma.article.findMany({
    where: {
      published: true,
      slug: { not: article.slug },
      category: article.category,
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function incrementViewCount(slug: string) {
  await prisma.article.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  });
}

/** Splits rendered HTML into the first N paragraphs and the remainder, for paywall previews. */
export function splitHtmlAtParagraph(html: string, paragraphCount: number) {
  const paragraphs = html.split(/(?=<p>)/g).filter(Boolean);
  const preview = paragraphs.slice(0, paragraphCount).join("");
  const rest = paragraphs.slice(paragraphCount).join("");
  return { preview, rest, isTruncated: paragraphs.length > paragraphCount };
}
