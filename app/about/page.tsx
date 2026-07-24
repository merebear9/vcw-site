import type { Metadata } from "next";
import { Mail, Phone, Coffee } from "lucide-react";
import Link from "next/link";
import FacebookIcon from "@/components/icons/FacebookIcon";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Vermilion County Watchdog is hyperlocal accountability journalism based in Danville, Illinois. Learn our mission and how to support us.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="heading-font text-3xl font-black text-white sm:text-5xl">
        Accountability. Transparency. Exposure.
      </h1>
      <p className="heading-font mt-4 text-sm tracking-widest text-vcw-red">
        Holding Power Accountable in Vermilion County
      </p>

      <section className="mt-10">
        <h2 className="heading-font text-xl font-bold text-white">Our Mission</h2>
        <p className="mt-3 text-vcw-gray">
          Vermilion County Watchdog exists to do the reporting no one else in
          Danville and Vermilion County, Illinois is doing: filing the records
          requests, sitting through the meetings, and reading the budgets line by
          line. We answer to our readers &mdash; not to advertisers, not to city
          hall, and not to anyone with something to hide.
        </p>
        <p className="mt-3 font-semibold text-white">
          Our City. Our People. Our Future. Together, We Can Make a Difference.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="heading-font text-xl font-bold text-white">
          Why Local Watchdog Journalism Matters
        </h2>
        <p className="mt-3 text-vcw-gray">
          Local newsrooms have closed across the country, and with them went the
          reporters who used to sit in the back of county board meetings. When no
          one is watching, budgets get quietly rewritten, contracts go
          unchallenged, and officials stop expecting to be asked hard questions.
          We built Vermilion County Watchdog to fill that gap &mdash; with more
          than 18,600 people following our reporting on Facebook, we&apos;re proof
          that this community still wants someone watching.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="heading-font text-xl font-bold text-white">How to Support Us</h2>
        <p className="mt-3 text-vcw-gray">
          Investigative journalism takes time and money &mdash; records requests,
          filing fees, and hours of review that don&apos;t happen for free.
          Readers are our only funding source.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/support" className="btn-primary">
            Become a Member
          </Link>
          <a
            href="https://buymeacoffee.com/vermilioncountywatchdog"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <Coffee size={18} /> Buy Me a Coffee
          </a>
        </div>
      </section>

      <section className="mt-10 border-t border-vcw-border pt-8">
        <h2 className="heading-font text-xl font-bold text-white">Contact</h2>
        <ul className="mt-4 space-y-3 text-sm text-vcw-gray">
          <li className="flex items-center gap-2">
            <Mail size={16} className="text-vcw-red" />
            <a href="mailto:vermilioncountywatchdog@gmail.com" className="hover:text-white">
              vermilioncountywatchdog@gmail.com
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Phone size={16} className="text-vcw-red" />
            <a href="tel:+13095328056" className="hover:text-white">
              (309) 532-8056
            </a>
          </li>
          <li className="flex items-center gap-2">
            <FacebookIcon size={16} className="text-vcw-red" />
            <a
              href="https://www.facebook.com/share/197AYkSH7q/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Follow us on Facebook
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-10 border-t border-vcw-border pt-8">
        <h2 className="heading-font text-xl font-bold text-white">
          Media Kit &amp; Advertising Inquiries
        </h2>
        <p className="mt-3 text-vcw-gray">
          Interested in reaching Vermilion County through a newsroom readers
          trust? Visit our{" "}
          <Link href="/advertise" className="text-vcw-red hover:text-vcw-redLight">
            advertising page
          </Link>{" "}
          for audience stats and sponsorship tiers, or email us directly.
        </p>
      </section>
    </div>
  );
}
