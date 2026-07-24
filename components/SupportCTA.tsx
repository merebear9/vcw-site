import Link from "next/link";

export default function SupportCTA() {
  return (
    <section className="bg-red-gradient">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="heading-font text-2xl font-black text-white sm:text-3xl">
            Local Corruption Doesn&apos;t Investigate Itself.
          </h2>
          <p className="mt-2 text-sm text-white/90 sm:text-base">
            Vermilion County Watchdog is reader-funded. Become a member to keep
            independent accountability journalism alive in Danville.
          </p>
        </div>
        <Link
          href="/support"
          className="heading-font shrink-0 whitespace-nowrap bg-vcw-black px-8 py-4 text-sm font-bold tracking-wide text-white transition-colors hover:bg-vcw-charcoal"
        >
          Support Our Work
        </Link>
      </div>
    </section>
  );
}
