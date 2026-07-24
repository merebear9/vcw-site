"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/utils";

export default function DocumentUploadForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("saving");
    setErrorMsg("");

    const res = await fetch("/api/admin/documents", {
      method: "POST",
      body: new FormData(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error ?? "Something went wrong.");
      setStatus("error");
      return;
    }

    form.reset();
    setStatus("idle");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-5">
      <h2 className="heading-font text-sm font-bold tracking-wide text-white">Add a Public Record</h2>
      <div>
        <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">Title</label>
        <input name="title" required className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none" />
      </div>
      <div>
        <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">Description</label>
        <textarea name="description" required rows={3} className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">Category</label>
          <select name="category" className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none">
            {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">Date Obtained</label>
          <input type="date" name="dateObtained" required className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">
          Related Article Slug (optional)
        </label>
        <input name="articleSlug" className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-2.5 text-sm text-white focus:border-vcw-red focus:outline-none" />
      </div>
      <div>
        <label className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">PDF File</label>
        <input type="file" name="file" accept="application/pdf" required className="w-full text-sm text-white" />
      </div>

      {status === "error" && <p className="text-sm text-vcw-red">{errorMsg}</p>}

      <button type="submit" disabled={status === "saving"} className="btn-primary w-full disabled:opacity-60">
        {status === "saving" ? "Uploading..." : "Add Record"}
      </button>
    </form>
  );
}
