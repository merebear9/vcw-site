import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), changeFrequency: "hourly", priority: 1 },
    { url: siteUrl("/records"), changeFrequency: "daily", priority: 0.8 },
    { url: siteUrl("/support"), changeFrequency: "weekly", priority: 0.7 },
    { url: siteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: siteUrl("/advertise"), changeFrequency: "monthly", priority: 0.4 },
    { url: siteUrl("/tips"), changeFrequency: "monthly", priority: 0.4 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: siteUrl(`/articles/${a.slug}`),
    lastModified: a.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...articleRoutes];
}
