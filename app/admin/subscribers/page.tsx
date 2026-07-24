import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="heading-font text-2xl font-black text-white">
          Newsletter Subscribers ({subscribers.length})
        </h1>
        <a href="/api/admin/subscribers/export" className="btn-outline text-xs">
          Export CSV
        </a>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-vcw-border text-left text-xs uppercase tracking-wide text-vcw-gray">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-b border-vcw-border">
                <td className="py-3 pr-4 text-white">{s.name ?? "—"}</td>
                <td className="py-3 pr-4 text-vcw-gray">{s.email}</td>
                <td className="py-3 text-vcw-gray">{formatDate(s.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <p className="py-8 text-center text-sm text-vcw-gray">No subscribers yet.</p>
        )}
      </div>
    </div>
  );
}
