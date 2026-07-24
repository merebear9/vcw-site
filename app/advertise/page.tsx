import type { Metadata } from "next";
import { Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AdInquiryForm from "./AdInquiryForm";

export const metadata: Metadata = {
  title: "Advertise With Us",
  description:
    "Reach Vermilion County through a newsroom local readers trust. Sponsorship tiers for local businesses.",
};

export const revalidate = 300;

const TIERS = [
  {
    name: "Banner Sponsor",
    price: 150,
    perks: ["Logo in sidebar on all pages", "Logo in footer on all pages"],
  },
  {
    name: "Story Sponsor",
    price: 250,
    perks: [
      "Everything in Banner Sponsor",
      '"Sponsored by" tag on homepage',
      "1 sponsored content post per month",
    ],
    featured: true,
  },
  {
    name: "Exclusive Partner",
    price: 500,
    perks: [
      "Everything in Story Sponsor",
      "Newsletter sponsor mention",
      "Dedicated sponsor page",
    ],
  },
];

export default async function AdvertisePage() {
  const [subscriberCount, memberCount] = await Promise.all([
    prisma.newsletterSubscriber.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="heading-font text-3xl font-black text-white sm:text-5xl">
          Reach Vermilion County
        </h1>
        <p className="mt-4 text-vcw-gray">
          Vermilion County Watchdog reaches an engaged, local audience that
          trusts our reporting. Put your business in front of readers who
          actually care about this community.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Facebook Followers", value: "18,600+" },
          { label: "Monthly Visitors", value: "Growing" },
          { label: "Email Subscribers", value: subscriberCount.toLocaleString() },
          { label: "Active Members", value: memberCount.toLocaleString() },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 text-center">
            <p className="heading-font text-2xl font-black text-vcw-red sm:text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-vcw-gray">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className={`card flex flex-col p-6 ${tier.featured ? "border-vcw-red" : ""}`}>
            {tier.featured && (
              <span className="heading-font mb-3 self-start bg-vcw-red px-2 py-1 text-[11px] font-bold tracking-wide text-white">
                Most Popular
              </span>
            )}
            <h3 className="heading-font text-xl font-bold text-white">{tier.name}</h3>
            <p className="mt-4">
              <span className="heading-font text-4xl font-black text-white">${tier.price}</span>
              <span className="text-sm text-vcw-gray">/mo</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm text-white/90">
                  <Check size={16} className="mt-0.5 shrink-0 text-vcw-red" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-xl border-t border-vcw-border pt-10">
        <h2 className="heading-font text-center text-xl font-bold text-white">
          Contact Us to Advertise
        </h2>
        <div className="mt-6">
          <AdInquiryForm />
        </div>
      </div>
    </div>
  );
}
