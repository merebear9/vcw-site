import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated."),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: z.string().min(1),
  tags: z.string().optional().default(""),
  author: z.string().min(1),
  featuredImage: z.string().optional().nullable(),
  accessLevel: z.enum(["free", "members_only"]),
  breaking: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  content: z.string().min(1),
  pdfUrl: z.string().optional().nullable(),
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const existing = await prisma.article.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "An article with that slug already exists." }, { status: 409 });
  }

  const article = await prisma.article.create({ data: parsed.data });
  return NextResponse.json({ article });
}
