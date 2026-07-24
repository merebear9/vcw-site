"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/records", label: "Public Records" },
  { href: "/support", label: "Support Us" },
  { href: "/tips", label: "Submit a Tip" },
  { href: "/about", label: "About" },
  { href: "/advertise", label: "Advertise" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-vcw-border bg-vcw-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="heading-font text-sm font-semibold tracking-wide text-white transition-colors hover:text-vcw-red"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/support" className="btn-primary">
            Become a Member
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-vcw-border bg-vcw-black lg:hidden">
          <ul className="flex flex-col divide-y divide-vcw-border">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="heading-font block px-4 py-3 text-sm font-semibold tracking-wide text-white hover:bg-vcw-charcoal hover:text-vcw-red"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="p-4">
              <Link href="/support" className="btn-primary w-full" onClick={() => setOpen(false)}>
                Become a Member
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
