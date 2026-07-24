import { NextRequest, NextResponse } from "next/server";
import { incrementViewCount } from "@/lib/articles";

export async function POST(_req: NextRequest, { params }: { params: { slug: string } }) {
  await incrementViewCount(params.slug).catch(() => null);
  return NextResponse.json({ success: true });
}
