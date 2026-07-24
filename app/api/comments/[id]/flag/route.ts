import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const comment = await prisma.comment.update({
    where: { id: params.id },
    data: { status: "FLAGGED" },
  }).catch(() => null);

  if (!comment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
