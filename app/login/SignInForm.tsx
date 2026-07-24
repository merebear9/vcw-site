"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm({ providerIds }: { providerIds: string[] }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const hasEmailProvider = providerIds.includes("email");
  const hasGoogleProvider = providerIds.includes("google");

  async function handleEmailSignIn(e: FormEvent) {
    e.preventDefault();
    if (!hasEmailProvider) return;
    await signIn("email", { email, redirect: false, callbackUrl: "/" });
    setSent(true);
  }

  if (providerIds.length === 0) {
    return (
      <p className="mt-8 text-sm text-vcw-gray">
        Sign-in is not configured yet. Set EMAIL_SERVER_* or GOOGLE_CLIENT_ID in
        your environment to enable it.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {hasGoogleProvider && (
        <button onClick={() => signIn("google", { callbackUrl: "/" })} className="btn-secondary w-full">
          Continue with Google
        </button>
      )}

      {hasEmailProvider && (
        <>
          {hasGoogleProvider && (
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-vcw-gray">
              <span className="h-px flex-1 bg-vcw-border" />
              or
              <span className="h-px flex-1 bg-vcw-border" />
            </div>
          )}
          {sent ? (
            <p className="text-sm text-vcw-red">
              Check your inbox &mdash; we sent a sign-in link to {email}.
            </p>
          ) : (
            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-vcw-border bg-vcw-charcoal px-4 py-3 text-sm text-white placeholder:text-vcw-gray focus:border-vcw-red focus:outline-none"
              />
              <button type="submit" className="btn-primary w-full">
                Email Me a Sign-In Link
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
