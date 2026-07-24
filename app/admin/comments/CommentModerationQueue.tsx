"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface CommentItem {
  id: string;
  body: string;
  status: string;
  createdAt: string;
  user: { name: string | null; email: string };
  article: { title: string; slug: string };
}

export default function CommentModerationQueue({ comments }: { comments: CommentItem[] }) {
  const router = useRouter();

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Permanently delete this comment?")) return;
    await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div key={c.id} className="card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-vcw-gray">
              <span className="font-semibold text-white">{c.user.name ?? c.user.email}</span>
              {" on "}
              <span className="text-vcw-red">{c.article.title}</span>
              {" — "}
              {formatDate(c.createdAt)}
            </div>
            <span
              className={`heading-font text-xs font-bold tracking-wide ${
                c.status === "FLAGGED" ? "text-vcw-red" : c.status === "HIDDEN" ? "text-vcw-gray" : "text-white/60"
              }`}
            >
              {c.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-white/90">{c.body}</p>
          <div className="mt-3 flex gap-3 text-xs">
            {c.status !== "VISIBLE" && (
              <button onClick={() => setStatus(c.id, "VISIBLE")} className="text-vcw-red hover:text-vcw-redLight">
                Approve
              </button>
            )}
            {c.status !== "HIDDEN" && (
              <button onClick={() => setStatus(c.id, "HIDDEN")} className="text-vcw-gray hover:text-white">
                Hide
              </button>
            )}
            <button onClick={() => remove(c.id)} className="text-vcw-gray hover:text-vcw-red">
              Delete
            </button>
          </div>
        </div>
      ))}
      {comments.length === 0 && <p className="text-sm text-vcw-gray">No comments to moderate.</p>}
    </div>
  );
}
