import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } });
  if (!article) {
    return NextResponse.json({ comments: [] });
  }

  const comments = await prisma.comment.findMany({
    where: { articleId: article.id, status: { not: "HIDDEN" } },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json({ comments });
}

const schema = z.object({ body: z.string().min(1).max(2000) });

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "You must be signed in to comment." }, { status: 401 });
  }

  const article = await prisma.article.findUnique({ where: { slug: params.slug } });
  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Comment cannot be empty." }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { body: parsed.data.body, articleId: article.id, userId },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json({ comment });
}
