import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const prisma = new PrismaClient();

async function seedArticles() {
  const dir = path.join(process.cwd(), "content", "articles");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");

    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        tags: data.tags ?? "",
        author: data.author,
        featuredImage: data.featured_image ?? null,
        accessLevel: data.access_level ?? "free",
        breaking: !!data.breaking,
        content,
        pdfUrl: data.pdf_url ?? null,
        viewCount: Math.floor(Math.random() * 800) + 50,
        publishedAt: new Date(data.date),
      },
    });
    console.log(`Seeded article: ${slug}`);
  }
}

async function seedDocuments() {
  const docs = [
    {
      title: "FOIA Response: Road Fund Budget Amendment",
      description:
        "Full FOIA response from the Vermilion County Clerk's office detailing the March budget amendment that redirected road maintenance funds.",
      category: "FOIA_RESPONSE" as const,
      dateObtained: new Date("2026-03-10"),
      fileUrl: "/documents/foia-road-fund-amendment.pdf",
      articleSlug: "county-board-secret-vote-road-funds",
    },
    {
      title: "FOIA Response: Police Overtime Payroll Detail (FY23-25)",
      description:
        "Payroll records for the Danville Police Department obtained via Freedom of Information Act request, covering fiscal years 2023 through 2025.",
      category: "FOIA_RESPONSE" as const,
      dateObtained: new Date("2026-02-28"),
      fileUrl: "/documents/foia-police-overtime-payroll.pdf",
      articleSlug: "danville-police-overtime-investigation",
    },
  ];

  for (const doc of docs) {
    const existing = await prisma.document.findFirst({ where: { title: doc.title } });
    if (!existing) {
      await prisma.document.create({ data: doc });
      console.log(`Seeded document: ${doc.title}`);
    }
  }
}

async function seedAdmin() {
  const email = "vermilioncountywatchdog@gmail.com";
  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: { email, name: "Vermilion County Watchdog", role: "ADMIN" },
  });
  console.log(`Seeded admin user: ${email}`);
}

async function main() {
  await seedArticles();
  await seedDocuments();
  await seedAdmin();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
