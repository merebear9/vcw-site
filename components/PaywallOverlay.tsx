import Link from "next/link";
import { Lock } from "lucide-react";

export default function PaywallOverlay() {
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm">
        <div className="article-body">
          <p>
            This investigation continues with documents, sourcing, and analysis
            available exclusively to Vermilion County Watchdog members. Members
            fund the records requests, the hours of review, and the follow-up
            reporting that make accountability journalism like this possible.
          </p>
          <p>
            Join today to read the rest of this story and every investigation we
            publish.
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-vcw-black/40 via-vcw-black/90 to-vcw-black px-4 text-center">
        <Lock size={32} className="text-vcw-red" />
        <h2 className="heading-font max-w-md text-2xl font-black text-white">
          Become a member to read the full investigation
        </h2>
        <p className="max-w-md text-sm text-vcw-gray">
          Your membership funds the FOIA requests and reporting hours behind
          stories like this one.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/support" className="btn-primary">
            Become a Member
          </Link>
          <a
            href="https://buymeacoffee.com/vermilioncountywatchdog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-vcw-gray underline hover:text-white"
          >
            Or support us on Buy Me a Coffee
          </a>
        </div>
      </div>
    </div>
  );
}
