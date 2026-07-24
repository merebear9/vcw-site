import { prisma } from "@/lib/prisma";
import { MEMBERSHIP_TIERS } from "@/lib/stripe";

export default async function AdminOverviewPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalMembers, activeSubscriptions, totalArticleViews, newSignupsThisMonth, totalSubscribers] =
    await Promise.all([
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.subscription.findMany({ where: { status: "ACTIVE" } }),
      prisma.article.aggregate({ _sum: { viewCount: true } }),
      prisma.newsletterSubscriber.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.newsletterSubscriber.count(),
    ]);

  const tierPrices = Object.fromEntries(MEMBERSHIP_TIERS.map((t) => [t.id, t.monthlyPrice]));
  const estimatedMonthlyRevenue = activeSubscriptions.reduce((sum, sub) => {
    const monthly = tierPrices[sub.tier as keyof typeof tierPrices] ?? 0;
    return sum + (sub.interval === "year" ? monthly : monthly);
  }, 0);

  const stats = [
    { label: "Active Members", value: totalMembers.toLocaleString() },
    { label: "Est. Monthly Revenue", value: `$${estimatedMonthlyRevenue.toLocaleString()}` },
    { label: "Total Article Views", value: (totalArticleViews._sum.viewCount ?? 0).toLocaleString() },
    { label: "New Signups This Month", value: newSignupsThisMonth.toLocaleString() },
    { label: "Total Newsletter Subscribers", value: totalSubscribers.toLocaleString() },
  ];

  return (
    <div>
      <h1 className="heading-font text-2xl font-black text-white">Overview</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="heading-font text-3xl font-black text-vcw-red">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-vcw-gray">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
