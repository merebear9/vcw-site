import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Vermilion County Watchdog account.",
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const providerIds = authOptions.providers.map((p) => p.id);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="heading-font text-3xl font-black text-white">Sign In</h1>
      <p className="mt-2 text-sm text-vcw-gray">
        Sign in to comment on stories and manage your membership.
      </p>
      <SignInForm providerIds={providerIds} />
    </div>
  );
}
