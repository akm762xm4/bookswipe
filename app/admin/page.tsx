import Link from "next/link";
import { BookOpen, Package } from "lucide-react";

export default function AdminPage() {
  const cards = [
    {
      href: "/admin/books",
      title: "Manage Books",
      description: "Create, edit, and organize books in the catalog.",
      Icon: BookOpen,
    },
    {
      href: "/admin/orders",
      title: "Manage Orders",
      description: "Review, update status, and track customer orders.",
      Icon: Package,
    },
  ];

  return (
    <section className="px-4 md:px-6 lg:px-8 py-6">
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white/90">Admin Dashboard</h1>
        <p className="text-sm text-white/60">Quick actions to manage your store</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ href, title, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group glass soft-shadow rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 grid place-items-center text-white">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-medium text-white/90">{title}</h2>
                <p className="text-xs md:text-sm text-white/60">{description}</p>
              </div>
            </div>

            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="mt-4 flex items-center justify-between text-white/70">
              <span className="text-xs">Open</span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}