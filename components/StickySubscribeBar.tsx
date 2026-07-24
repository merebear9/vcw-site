"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "vcw-sticky-bar-dismissed";

export default function StickySubscribeBar() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    setDismissed(stored === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-vcw-red bg-vcw-black px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <p className="heading-font text-xs font-bold tracking-wide text-white">
          Subscribe for full access to every investigation
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/support" className="btn-primary px-4 py-2 text-xs">
            Join
          </Link>
          <button
            type="button"
            aria-label="Dismiss"
            className="text-vcw-gray hover:text-white"
            onClick={() => {
              window.sessionStorage.setItem(STORAGE_KEY, "1");
              setDismissed(true);
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
