import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  const rows = [
    ["Name", "Email", "Subscribed At"],
    ...subscribers.map((s) => [s.name ?? "", s.email, s.createdAt.toISOString()]),
  ];
  const csv = rows.map((row) => row.map((cell) => csvEscape(String(cell))).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="vcw-newsletter-subscribers.csv"`,
    },
  });
}
