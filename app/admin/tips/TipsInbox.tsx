"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface TipItem {
  id: string;
  subject: string;
  message: string;
  fileUrl: string | null;
  status: string;
  createdAt: string;
}

export default function TipsInbox({ tips }: { tips: TipItem[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/tips/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {tips.map((tip) => (
        <div key={tip.id} className="card p-4">
          <button
            className="flex w-full items-center justify-between gap-4 text-left"
            onClick={() => setExpanded(expanded === tip.id ? null : tip.id)}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{tip.subject}</p>
              <p className="mt-0.5 text-xs text-vcw-gray">{formatDate(tip.createdAt)}</p>
            </div>
            <span
              className={`heading-font shrink-0 text-xs font-bold tracking-wide ${
                tip.status === "NEW" ? "text-vcw-red" : "text-vcw-gray"
              }`}
            >
              {tip.status}
            </span>
          </button>

          {expanded === tip.id && (
            <div className="mt-4 border-t border-vcw-border pt-4">
              <p className="whitespace-pre-wrap text-sm text-white/90">{tip.message}</p>
              {tip.fileUrl && (
                <a href={tip.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-vcw-red hover:text-vcw-redLight">
                  View attached file
                </a>
              )}
              <div className="mt-4 flex gap-3">
                {tip.status !== "REVIEWED" && (
                  <button onClick={() => setStatus(tip.id, "REVIEWED")} className="btn-outline text-xs">
                    Mark Reviewed
                  </button>
                )}
                {tip.status !== "ARCHIVED" && (
                  <button onClick={() => setStatus(tip.id, "ARCHIVED")} className="btn-secondary text-xs">
                    Archive
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      {tips.length === 0 && <p className="text-sm text-vcw-gray">No tips submitted yet.</p>}
    </div>
  );
}
