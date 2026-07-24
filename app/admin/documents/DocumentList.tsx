"use client";

import { useRouter } from "next/navigation";
import { formatDate, DOCUMENT_CATEGORY_LABELS } from "@/lib/utils";

interface DocItem {
  id: string;
  title: string;
  category: string;
  dateObtained: string;
  fileUrl: string;
}

export default function DocumentList({ documents }: { documents: DocItem[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this record?")) return;
    await fetch(`/api/admin/documents/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc.id} className="card flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{doc.title}</p>
            <p className="mt-0.5 text-xs text-vcw-gray">
              {DOCUMENT_CATEGORY_LABELS[doc.category] ?? doc.category} &middot; {formatDate(doc.dateObtained)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4 text-xs">
            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-vcw-red hover:text-vcw-redLight">
              View
            </a>
            <button onClick={() => handleDelete(doc.id)} className="text-vcw-gray hover:text-vcw-red">
              Delete
            </button>
          </div>
        </div>
      ))}
      {documents.length === 0 && <p className="text-sm text-vcw-gray">No documents uploaded yet.</p>}
    </div>
  );
}
