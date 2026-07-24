"use client";

import { useState, type FormEvent } from "react";
import { Paperclip } from "lucide-react";

export default function TipForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/tips", {
        method: "POST",
        body: new FormData(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
      setFileName("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="card mt-8 p-6 text-center">
        <p className="heading-font text-lg font-bold text-vcw-red">Tip received.</p>
        <p className="mt-2 text-sm text-vcw-gray">
          Thank you for trusting us with this. Our editors review every
          submission.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="subject" className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          maxLength={200}
          className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-3 text-sm text-white focus:border-vcw-red focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="message" className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={8}
          maxLength={10000}
          className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-3 text-sm text-white focus:border-vcw-red focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="file"
          className="btn-secondary inline-flex w-full cursor-pointer items-center justify-center gap-2"
        >
          <Paperclip size={16} />
          {fileName || "Attach a file (optional, up to 10MB)"}
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="application/pdf,image/png,image/jpeg,image/webp,image/heic"
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        />
      </div>

      {status === "error" && <p className="text-sm text-vcw-red">{errorMsg}</p>}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-60">
        {status === "loading" ? "Submitting..." : "Submit Tip"}
      </button>
    </form>
  );
}
