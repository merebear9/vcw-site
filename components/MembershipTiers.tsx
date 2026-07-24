"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { MEMBERSHIP_TIERS, type MembershipTierId } from "@/lib/stripe";

export default function MembershipTiers() {
  const [interval, setInterval_] = useState<"month" | "year">("month");
  const [loadingTier, setLoadingTier] = useState<MembershipTierId | null>(null);
  const router = useRouter();

  async function handleSubscribe(tier: MembershipTierId) {
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, interval }),
      });

      if (res.status === 401) {
        router.push(`/login?callbackUrl=/support`);
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong. Please try again.");
      }
    } finally {
      setLoadingTier(null);
    }
  }

  return (
    <div>
      <div className="mb-10 flex items-center justify-center gap-4">
        <span className={`heading-font text-sm font-bold ${interval === "month" ? "text-white" : "text-vcw-gray"}`}>
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={interval === "year"}
          onClick={() => setInterval_((v) => (v === "month" ? "year" : "month"))}
          className="relative h-7 w-14 rounded-full bg-vcw-charcoal2 transition-colors"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-vcw-red transition-transform ${
              interval === "year" ? "translate-x-8" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`heading-font text-sm font-bold ${interval === "year" ? "text-white" : "text-vcw-gray"}`}>
          Annual <span className="text-vcw-red">(2 months free)</span>
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {MEMBERSHIP_TIERS.map((tier, i) => {
          const price = interval === "month" ? tier.monthlyPrice : tier.annualPrice;
          const isFeatured = i === 1;
          return (
            <div
              key={tier.id}
              className={`card flex flex-col p-6 ${isFeatured ? "border-vcw-red" : ""}`}
            >
              {isFeatured && (
                <span className="heading-font mb-3 self-start bg-vcw-red px-2 py-1 text-[11px] font-bold tracking-wide text-white">
                  Most Popular
                </span>
              )}
              <h3 className="heading-font text-xl font-bold text-white">{tier.name}</h3>
              <p className="mt-4">
                <span className="heading-font text-4xl font-black text-white">${price}</span>
                <span className="text-sm text-vcw-gray">/{interval === "month" ? "mo" : "yr"}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-white/90">
                    <Check size={16} className="mt-0.5 shrink-0 text-vcw-red" />
                    {perk}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(tier.id)}
                disabled={loadingTier === tier.id}
                className={`mt-8 ${isFeatured ? "btn-primary" : "btn-outline"} disabled:opacity-60`}
              >
                {loadingTier === tier.id ? "Redirecting..." : `Join as ${tier.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
