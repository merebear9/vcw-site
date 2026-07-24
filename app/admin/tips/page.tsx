import { prisma } from "@/lib/prisma";
import TipsInbox from "./TipsInbox";

export default async function AdminTipsPage() {
  const tips = await prisma.tip.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="heading-font mb-6 text-2xl font-black text-white">Tips Inbox</h1>
      <TipsInbox
        tips={tips.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() }))}
      />
    </div>
  );
}
