"use client";

import { useState, type FormEvent } from "react";

const TIERS = ["Banner Sponsor — $150/mo", "Story Sponsor — $250/mo", "Exclusive Partner — $500/mo", "Not sure yet"];

export default function AdInquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/ad-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="card p-6 text-center">
        <p className="heading-font text-lg font-bold text-vcw-red">Thanks for reaching out.</p>
        <p className="mt-2 text-sm text-vcw-gray">We&apos;ll get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">
            Name
          </label>
          <input id="name" name="name" required className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-3 text-sm text-white focus:border-vcw-red focus:outline-none" />
        </div>
        <div>
          <label htmlFor="business" className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">
            Business
          </label>
          <input id="business" name="business" required className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-3 text-sm text-white focus:border-vcw-red focus:outline-none" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">
          Email
        </label>
        <input id="email" name="email" type="email" required className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-3 text-sm text-white focus:border-vcw-red focus:outline-none" />
      </div>

      <div>
        <label htmlFor="tier" className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">
          Interested In
        </label>
        <select id="tier" name="tier" className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-3 text-sm text-white focus:border-vcw-red focus:outline-none">
          {TIERS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="heading-font mb-1.5 block text-xs font-bold tracking-wide text-white">
          Message
        </label>
        <textarea id="message" name="message" rows={5} required className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-3 text-sm text-white focus:border-vcw-red focus:outline-none" />
      </div>

      {status === "error" && <p className="text-sm text-vcw-red">{errorMsg}</p>}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-60">
        {status === "loading" ? "Sending..." : "Contact Us to Advertise"}
      </button>
    </form>
  );
}
