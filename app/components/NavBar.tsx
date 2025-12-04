"use client";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setUser(data);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  const isActive = (href: string) =>
    pathname === href ? "text-white" : "text-slate-300 hover:text-white";

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full bg-slate-800 px-3 p-3 text-sm text-slate-200 hover:bg-slate-700"
          aria-label="Go back"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/" className={isActive("/")}>
            Home
          </Link>
          <Link href="/explore" className={isActive("/explore")}>
            Explore
          </Link>
          <Link href="/cart" className={isActive("/cart")}>
            Cart
          </Link>
          <Link href="/checkout" className={isActive("/checkout")}>
            Checkout
          </Link>
          <Link href="/orders" className={isActive("/orders")}>
            Orders
          </Link>
          <Link href="/profile" className={isActive("/profile")}>
            Profile
          </Link>
          <span className="mx-2 h-4 w-px bg-slate-700" />
          <Link href="/admin" className={isActive("/admin")}>
            Admin
          </Link>
          <Link href="/admin/books" className={isActive("/admin/books")}>
            Admin Books
          </Link>
          <Link href="/admin/orders" className={isActive("/admin/orders")}>
            Admin Orders
          </Link>
          <span className="mx-2 h-4 w-px bg-slate-700" />
          <Link href="/auth/login" className={isActive("/auth/login")}>
            Login
          </Link>
          <Link href="/auth/register" className={isActive("/auth/register")}>
            Register
          </Link>
          {user ? (
            <>
              <span className="text-slate-300">Hi, {user.name || "User"}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={isActive("/auth/login")}>
                Login
              </Link>
              <Link
                href="/auth/register"
                className={isActive("/auth/register")}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
