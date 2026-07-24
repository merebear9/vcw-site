import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArticleForm from "../ArticleForm";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({ where: { id: params.id } });
  if (!article) notFound();

  return (
    <div>
      <h1 className="heading-font mb-6 text-2xl font-black text-white">Edit Article</h1>
      <ArticleForm
        mode="edit"
        initial={{
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          category: article.category,
          tags: article.tags,
          author: article.author,
          featuredImage: article.featuredImage ?? "",
          accessLevel: article.accessLevel as "free" | "members_only",
          breaking: article.breaking,
          published: article.published,
          content: article.content,
          pdfUrl: article.pdfUrl ?? "",
        }}
      />
    </div>
  );
}
