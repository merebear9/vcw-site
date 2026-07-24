import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import TipForm from "./TipForm";

export const metadata: Metadata = {
  title: "Submit an Anonymous Tip",
  description:
    "Send Vermilion County Watchdog an anonymous tip. We do not log IP addresses or require identifying information.",
};

export default function TipsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="heading-font text-3xl font-black text-white sm:text-4xl">
        Anonymous Tip Line
      </h1>
      <p className="mt-4 text-vcw-gray">
        If you have information about corruption, misconduct, or public records
        worth investigating in Vermilion County, we want to hear from you.
      </p>

      <div className="card mt-8 flex gap-3 p-4">
        <ShieldCheck size={22} className="mt-0.5 shrink-0 text-vcw-red" />
        <p className="text-sm text-white/90">
          <span className="font-semibold">Your identity is protected.</span> We
          do not log IP addresses or require any identifying information to
          submit a tip. Only include your contact information in the message if
          you want us to follow up with you directly.
        </p>
      </div>

      <TipForm />

      <p className="mt-8 text-center text-xs text-vcw-gray">
        For maximum security, you can also reach us via Signal at the number
        listed on our{" "}
        <a href="/about" className="text-vcw-red hover:text-vcw-redLight">
          About page
        </a>
        .
      </p>
    </div>
  );
}
