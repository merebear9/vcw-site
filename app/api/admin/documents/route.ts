import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import { DocumentCategory } from "@prisma/client";
import { requireAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = path.join(process.cwd(), "public", "documents");
const MAX_FILE_BYTES = 25 * 1024 * 1024;

function parseCategory(value: string): DocumentCategory {
  return value in DocumentCategory ? (value as DocumentCategory) : DocumentCategory.OTHER;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const documents = await prisma.document.findMany({ orderBy: { dateObtained: "desc" } });
  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "OTHER");
  const dateObtained = String(formData.get("dateObtained") ?? "");
  const articleSlug = String(formData.get("articleSlug") ?? "").trim() || null;
  const file = formData.get("file");

  if (!title || !description || !dateObtained) {
    return NextResponse.json({ error: "Title, description, and date are required." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "A PDF file is required." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File must be 25MB or smaller." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  const document = await prisma.document.create({
    data: {
      title,
      description,
      category: parseCategory(category),
      dateObtained: new Date(dateObtained),
      fileUrl: `/documents/${filename}`,
      articleSlug,
    },
  });

  return NextResponse.json({ document });
}
