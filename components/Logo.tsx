import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="Vermilion County Watchdog home">
      <Image
        src="/images/logo.png"
        alt="Vermilion County Watchdog"
        width={1142}
        height={734}
        priority
        className="h-12 w-auto sm:h-14"
      />
    </Link>
  );
}
