import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/adminAuth";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/tips", label: "Tips Inbox" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/comments", label: "Comments" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  if (!session) redirect("/login?callbackUrl=/admin");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row">
      <aside className="lg:w-56 lg:shrink-0">
        <h2 className="heading-font mb-4 text-xs font-bold tracking-widest text-vcw-red">
          Admin
        </h2>
        <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="heading-font rounded-none px-3 py-2 text-sm font-semibold text-white hover:bg-vcw-charcoal hover:text-vcw-red"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
