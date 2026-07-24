import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ status: z.enum(["VISIBLE", "FLAGGED", "HIDDEN"]) });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  const comment = await prisma.comment
    .update({ where: { id: params.id }, data: { status: parsed.data.status } })
    .catch(() => null);

  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ comment });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.comment.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ success: true });
}
