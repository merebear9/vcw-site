import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().max(200).optional().nullable(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const { name, email } = parsed.data;

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: { name: name ?? undefined },
    create: { name: name ?? undefined, email },
  });

  return NextResponse.json({ success: true });
}
