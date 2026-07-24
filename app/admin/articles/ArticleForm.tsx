"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export interface ArticleFormValues {
  id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  author: string;
  featuredImage: string;
  accessLevel: "free" | "members_only";
  breaking: boolean;
  published: boolean;
  content: string;
  pdfUrl: string;
}

const CATEGORIES = [
  "County Government",
  "City Government",
  "Public Safety",
  "Breaking News",
  "Courts",
  "Education",
  "Investigations",
];

export default function ArticleForm({
  initial,
  mode,
}: {
  initial: ArticleFormValues;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update<K extends keyof ArticleFormValues>(key: K, value: ArticleFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");

    const payload = {
      ...values,
      featuredImage: values.featuredImage || null,
      pdfUrl: values.pdfUrl || null,
    };

    const res =
      mode === "create"
        ? await fetch("/api/admin/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/articles/${values.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error ?? "Something went wrong.");
      setStatus("error");
      return;
    }

    router.push("/admin/articles");
    router.refresh();
  }

  async function handleDelete() {
    if (!values.id) return;
    if (!confirm("Delete this article? This cannot be undone.")) return;
    await fetch(`/api/admin/articles/${values.id}`, { method: "DELETE" });
    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">Title</label>
          <input
            required
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none"
          />
        </div>
        {mode === "create" && (
          <div>
            <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">
              Slug (URL)
            </label>
            <input
              required
              value={values.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="my-article-title"
              className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none"
            />
          </div>
        )}
      </div>

      <div>
        <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">Excerpt</label>
        <textarea
          required
          rows={2}
          value={values.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">Category</label>
          <select
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">Author</label>
          <input
            required
            value={values.author}
            onChange={(e) => update("author", e.target.value)}
            className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none"
          />
        </div>
        <div>
          <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">Tags (comma-separated)</label>
          <input
            value={values.tags}
            onChange={(e) => update("tags", e.target.value)}
            className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">
            Featured Image Path
          </label>
          <input
            value={values.featuredImage}
            onChange={(e) => update("featuredImage", e.target.value)}
            placeholder="/images/articles/example.svg"
            className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none"
          />
        </div>
        <div>
          <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">
            Attached PDF Path
          </label>
          <input
            value={values.pdfUrl}
            onChange={(e) => update("pdfUrl", e.target.value)}
            placeholder="/documents/example.pdf"
            className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            checked={values.accessLevel === "members_only"}
            onChange={(e) => update("accessLevel", e.target.checked ? "members_only" : "free")}
            className="h-4 w-4 accent-vcw-red"
          />
          Members Only
        </label>
        <label className="flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            checked={values.breaking}
            onChange={(e) => update("breaking", e.target.checked)}
            className="h-4 w-4 accent-vcw-red"
          />
          Breaking News
        </label>
        <label className="flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => update("published", e.target.checked)}
            className="h-4 w-4 accent-vcw-red"
          />
          Published
        </label>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="heading-font text-xs font-bold tracking-wide text-white">
            Content (Markdown)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-xs text-vcw-red hover:text-vcw-redLight"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        {showPreview ? (
          <div className="article-body max-h-96 overflow-y-auto border border-vcw-border bg-vcw-charcoal p-4">
            {values.content.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <textarea
            required
            rows={16}
            value={values.content}
            onChange={(e) => update("content", e.target.value)}
            className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-3 font-mono text-sm text-white focus:border-vcw-red focus:outline-none"
          />
        )}
      </div>

      {status === "error" && <p className="text-sm text-vcw-red">{errorMsg}</p>}

      <div className="flex items-center justify-between">
        <button type="submit" disabled={status === "saving"} className="btn-primary disabled:opacity-60">
          {status === "saving" ? "Saving..." : mode === "create" ? "Create Article" : "Save Changes"}
        </button>
        {mode === "edit" && (
          <button type="button" onClick={handleDelete} className="text-sm text-vcw-gray hover:text-vcw-red">
            Delete Article
          </button>
        )}
      </div>
    </form>
  );
}
