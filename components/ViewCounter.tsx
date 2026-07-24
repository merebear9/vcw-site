"use client";

import { useEffect, useRef } from "react";

export default function ViewCounter({ slug }: { slug: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch(`/api/articles/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
