import type { Metadata } from "next";
import { Coffee } from "lucide-react";
import { prisma } from "@/lib/prisma";
import MembershipTiers from "@/components/MembershipTiers";

export const metadata: Metadata = {
  title: "Support Our Work",
  description:
    "Become a member of Vermilion County Watchdog and fund independent accountability journalism in Danville and Vermilion County, Illinois.",
};

export const revalidate = 300;

export default async function SupportPage() {
  const supporters = await prisma.user.findMany({
    where: {
      showOnSupportersWall: true,
      subscription: { tier: "FOUNDING", status: "ACTIVE" },
    },
    select: { name: true, email: true },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="heading-font text-3xl font-black text-white sm:text-5xl">
          Support Our Work
        </h1>
        <p className="mt-4 text-vcw-gray">
          Vermilion County Watchdog is funded by readers, not corporations or
          political interests. Your membership pays for records requests, court
          filing fees, and the hours it takes to hold power accountable.
        </p>
      </header>

      <div className="mt-14">
        <MembershipTiers />
      </div>

      <div className="mx-auto mt-16 max-w-xl border-t border-vcw-border pt-10 text-center">
        <h2 className="heading-font text-lg font-bold text-white">
          Not Ready to Subscribe? You Can Still Support Us
        </h2>
        <a
          href="https://buymeacoffee.com/vermilioncountywatchdog"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline mt-5 inline-flex"
        >
          <Coffee size={18} /> Buy Me a Coffee
        </a>
      </div>

      {supporters.length > 0 && (
        <div className="mx-auto mt-16 max-w-3xl border-t border-vcw-border pt-10 text-center">
          <h2 className="heading-font text-lg font-bold text-white">Founding Members</h2>
          <p className="mt-2 text-sm text-vcw-gray">
            Thank you to the readers who make our accountability reporting possible.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {supporters.map((s) => (
              <span key={s.email} className="heading-font text-sm font-semibold text-white">
                {s.name ?? s.email.split("@")[0]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
