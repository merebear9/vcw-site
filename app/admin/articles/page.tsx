import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="heading-font text-2xl font-black text-white">Articles</h1>
        <Link href="/admin/articles/new" className="btn-primary text-xs">
          New Article
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-vcw-border text-left text-xs uppercase tracking-wide text-vcw-gray">
              <th className="py-3 pr-4">Title</th>
              <th className="py-3 pr-4">Access</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Views</th>
              <th className="py-3 pr-4">Date</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-vcw-border">
                <td className="max-w-xs truncate py-3 pr-4 font-medium text-white">{a.title}</td>
                <td className="py-3 pr-4 text-vcw-gray">
                  {a.accessLevel === "members_only" ? "Members" : "Free"}
                </td>
                <td className="py-3 pr-4">
                  <span className={a.published ? "text-vcw-red" : "text-vcw-gray"}>
                    {a.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-3 pr-4 text-vcw-gray">{a.viewCount.toLocaleString()}</td>
                <td className="py-3 pr-4 text-vcw-gray">{formatDate(a.publishedAt)}</td>
                <td className="py-3 text-right">
                  <Link href={`/admin/articles/${a.id}`} className="text-vcw-red hover:text-vcw-redLight">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <p className="py-8 text-center text-sm text-vcw-gray">No articles yet.</p>
        )}
      </div>
    </div>
  );
}
