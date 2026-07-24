"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, FileText, Download, ExternalLink } from "lucide-react";
import { formatDate, DOCUMENT_CATEGORY_LABELS } from "@/lib/utils";

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  dateObtained: string;
  fileUrl: string;
  articleSlug: string | null;
}

const CATEGORIES = Object.entries(DOCUMENT_CATEGORY_LABELS);

export default function RecordsBrowser({ documents }: { documents: DocumentItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesQuery =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q);
      const matchesCategory = category === "ALL" || doc.category === category;
      const docDate = doc.dateObtained.slice(0, 10);
      const matchesStart = !startDate || docDate >= startDate;
      const matchesEnd = !endDate || docDate <= endDate;
      return matchesQuery && matchesCategory && matchesStart && matchesEnd;
    });
  }, [documents, query, category, startDate, endDate]);

  return (
    <div>
      <div className="card mb-8 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-vcw-gray" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles & descriptions..."
            className="w-full border border-vcw-border bg-vcw-charcoal py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-vcw-gray focus:border-vcw-red focus:outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-vcw-border bg-vcw-charcoal px-3 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          {CATEGORIES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          aria-label="From date"
          className="border border-vcw-border bg-vcw-charcoal px-3 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          aria-label="To date"
          className="border border-vcw-border bg-vcw-charcoal px-3 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none"
        />
      </div>

      <p className="mb-4 text-xs uppercase tracking-wide text-vcw-gray">
        {filtered.length} record{filtered.length === 1 ? "" : "s"} found
      </p>

      <div className="space-y-4">
        {filtered.map((doc) => (
          <div key={doc.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-vcw-red/10 text-vcw-red">
              <FileText size={20} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="category-badge">{DOCUMENT_CATEGORY_LABELS[doc.category] ?? doc.category}</span>
                <span className="text-xs uppercase tracking-wide text-vcw-gray">
                  Obtained {formatDate(doc.dateObtained)}
                </span>
              </div>
              <h3 className="heading-font mt-2 text-lg font-bold text-white">{doc.title}</h3>
              <p className="mt-1 text-sm text-vcw-gray">{doc.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="heading-font flex items-center gap-1.5 font-bold tracking-wide text-vcw-red hover:text-vcw-redLight"
                >
                  <ExternalLink size={14} /> View PDF
                </a>
                <a
                  href={doc.fileUrl}
                  download
                  className="heading-font flex items-center gap-1.5 font-bold tracking-wide text-white hover:text-vcw-red"
                >
                  <Download size={14} /> Download
                </a>
                {doc.articleSlug && (
                  <Link href={`/articles/${doc.articleSlug}`} className="text-vcw-gray underline hover:text-white">
                    Read the related story
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-vcw-gray">
            No records match your search. Try broadening your filters.
          </p>
        )}
      </div>
    </div>
  );
}
