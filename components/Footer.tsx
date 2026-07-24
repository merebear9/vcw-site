import Link from "next/link";
import { Coffee, Mail, Phone } from "lucide-react";
import Logo from "./Logo";
import FacebookIcon from "./icons/FacebookIcon";

export default function Footer() {
  return (
    <footer className="border-t border-vcw-border bg-vcw-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-md text-sm text-vcw-gray">
            Vermilion County Watchdog is hyperlocal accountability journalism based in
            Danville, Illinois. We investigate public records, attend the meetings
            no one else covers, and hold local power accountable &mdash; because our
            city, our people, and our future are worth fighting for.
          </p>
          <p className="heading-font mt-4 text-xs tracking-widest text-vcw-red">
            Our City. Our People. Our Future. Together, We Can Make a Difference.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <a
              href="https://www.facebook.com/share/197AYkSH7q/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vermilion County Watchdog on Facebook"
              className="text-vcw-gray transition-colors hover:text-vcw-red"
            >
              <FacebookIcon size={22} />
            </a>
            <a
              href="https://buymeacoffee.com/vermilioncountywatchdog"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Support us on Buy Me a Coffee"
              className="text-vcw-gray transition-colors hover:text-vcw-red"
            >
              <Coffee size={22} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="heading-font mb-4 text-sm font-bold tracking-wide text-white">
            Navigate
          </h3>
          <ul className="space-y-2 text-sm text-vcw-gray">
            <li><Link href="/records" className="hover:text-vcw-red">Public Records</Link></li>
            <li><Link href="/support" className="hover:text-vcw-red">Membership</Link></li>
            <li><Link href="/tips" className="hover:text-vcw-red">Submit a Tip</Link></li>
            <li><Link href="/about" className="hover:text-vcw-red">About Us</Link></li>
            <li><Link href="/advertise" className="hover:text-vcw-red">Advertise</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="heading-font mb-4 text-sm font-bold tracking-wide text-white">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-vcw-gray">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-vcw-red" />
              <a href="mailto:vermilioncountywatchdog@gmail.com" className="hover:text-vcw-red">
                vermilioncountywatchdog@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-vcw-red" />
              <a href="tel:+13095328056" className="hover:text-vcw-red">
                (309) 532-8056
              </a>
            </li>
            <li>Danville, Illinois</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-vcw-border px-4 py-6 text-center text-xs text-vcw-gray sm:px-6">
        &copy; {new Date().getFullYear()} Vermilion County Watchdog. All rights reserved.
      </div>
    </footer>
  );
}
