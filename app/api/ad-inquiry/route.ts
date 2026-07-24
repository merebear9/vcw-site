import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).max(200),
  business: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
  tier: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill out all required fields." }, { status: 400 });
  }

  const { name, business, email, message, tier } = parsed.data;
  await prisma.adInquiry.create({
    data: { name, business, email, message, tier: tier ?? null },
  });

  return NextResponse.json({ success: true });
}
