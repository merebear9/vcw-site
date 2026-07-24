"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterForm({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
        }),
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
      <p className={`heading-font text-sm font-semibold text-vcw-red ${className}`}>
        You&apos;re on the list. Thanks for standing with us.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        autoComplete="name"
        className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-3 text-sm text-white placeholder:text-vcw-gray focus:border-vcw-red focus:outline-none sm:w-40"
      />
      <input
        type="email"
        name="email"
        required
        placeholder="Email address"
        autoComplete="email"
        className="w-full flex-1 border border-vcw-border bg-vcw-charcoal px-4 py-3 text-sm text-white placeholder:text-vcw-gray focus:border-vcw-red focus:outline-none"
      />
      <button type="submit" disabled={status === "loading"} className="btn-primary whitespace-nowrap disabled:opacity-60">
        {status === "loading" ? "Signing up..." : "Sign Up Free"}
      </button>
      {status === "error" && (
        <p className="basis-full text-sm text-vcw-red">{errorMsg}</p>
      )}
    </form>
  );
}
