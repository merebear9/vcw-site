import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  tags: z.string().optional(),
  author: z.string().min(1).optional(),
  featuredImage: z.string().optional().nullable(),
  accessLevel: z.enum(["free", "members_only"]).optional(),
  breaking: z.boolean().optional(),
  published: z.boolean().optional(),
  content: z.string().min(1).optional(),
  pdfUrl: z.string().optional().nullable(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const article = await prisma.article.findUnique({ where: { id: params.id } });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ article });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const article = await prisma.article
    .update({ where: { id: params.id }, data: parsed.data })
    .catch(() => null);

  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ article });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.article.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ success: true });
}
