import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/prisma";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp", "image/heic"]);
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "tips");

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const file = formData.get("file");

  if (!subject || !message) {
    return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });
  }
  if (subject.length > 200 || message.length > 10000) {
    return NextResponse.json({ error: "Submission is too long." }, { status: 400 });
  }

  let fileUrl: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File must be 10MB or smaller." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const ext = path.extname(file.name).slice(0, 10) || "";
    const filename = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
    fileUrl = `/uploads/tips/${filename}`;
  }

  await prisma.tip.create({
    data: { subject, message, fileUrl },
  });

  return NextResponse.json({ success: true });
}
