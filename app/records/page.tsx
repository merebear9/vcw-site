import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import RecordsBrowser from "./RecordsBrowser";

export const metadata: Metadata = {
  title: "Public Records Database",
  description:
    "Searchable archive of public documents obtained by Vermilion County Watchdog, including FOIA responses, meeting minutes, court filings, and budget records.",
};

export const revalidate = 60;

export default async function RecordsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { dateObtained: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <h1 className="heading-font text-3xl font-black text-white sm:text-4xl">
          Public Records Database
        </h1>
        <p className="mt-3 text-vcw-gray">
          Every document below was obtained through public records requests and is
          free to search, read, and download. This is your government &mdash; these
          are your records.
        </p>
      </header>

      <RecordsBrowser
        documents={documents.map((d) => ({
          ...d,
          dateObtained: d.dateObtained.toISOString(),
          createdAt: d.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
