"use client";

import { useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";
import FacebookIcon from "./icons/FacebookIcon";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; silently ignore
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="heading-font text-xs font-bold tracking-widest text-vcw-gray">Share</span>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="flex h-9 w-9 items-center justify-center border border-vcw-border text-white transition-colors hover:border-vcw-red hover:text-vcw-red"
      >
        <FacebookIcon size={16} />
      </a>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="flex h-9 w-9 items-center justify-center border border-vcw-border text-white transition-colors hover:border-vcw-red hover:text-vcw-red"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center border border-vcw-border text-white transition-colors hover:border-vcw-red hover:text-vcw-red"
      >
        {copied ? <Check size={16} /> : <LinkIcon size={16} />}
      </button>
    </div>
  );
}
