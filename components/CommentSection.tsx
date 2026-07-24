"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSession, signIn } from "next-auth/react";
import { Flag } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CommentItem {
  id: string;
  body: string;
  createdAt: string;
  status: string;
  user: { name: string | null; email: string };
}

export default function CommentSection({ articleId }: { articleId: string }) {
  const { status: sessionStatus } = useSession();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/articles/${articleId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data.comments ?? []))
      .finally(() => setLoading(false));
  }, [articleId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data.comment, ...prev]);
        setBody("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function flagComment(id: string) {
    await fetch(`/api/comments/${id}/flag`, { method: "POST" });
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "FLAGGED" } : c))
    );
  }

  const visibleComments = comments.filter((c) => c.status !== "HIDDEN");

  return (
    <section className="mt-16 border-t border-vcw-border pt-10">
      <h2 className="heading-font mb-6 text-xl font-bold text-white">
        Comments ({visibleComments.length})
      </h2>

      {sessionStatus === "authenticated" ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Join the discussion..."
            className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-3 text-sm text-white placeholder:text-vcw-gray focus:border-vcw-red focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button type="submit" disabled={submitting} className="btn-primary text-xs disabled:opacity-60">
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="card mb-8 flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-vcw-gray">Sign in to join the discussion.</p>
          <button onClick={() => signIn()} className="btn-outline text-xs">
            Sign In
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-vcw-gray">Loading comments...</p>
      ) : visibleComments.length === 0 ? (
        <p className="text-sm text-vcw-gray">No comments yet. Be the first to weigh in.</p>
      ) : (
        <ul className="space-y-6">
          {visibleComments.map((comment) => (
            <li key={comment.id} className="border-b border-vcw-border pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {comment.user.name ?? comment.user.email.split("@")[0]}
                  </span>
                  <span className="text-xs text-vcw-gray">{formatDate(comment.createdAt)}</span>
                  {comment.status === "FLAGGED" && (
                    <span className="text-xs font-bold uppercase text-vcw-red">Flagged</span>
                  )}
                </div>
                <button
                  onClick={() => flagComment(comment.id)}
                  aria-label="Flag comment"
                  className="text-vcw-gray hover:text-vcw-red"
                >
                  <Flag size={14} />
                </button>
              </div>
              <p className="mt-2 text-sm text-white/90">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
