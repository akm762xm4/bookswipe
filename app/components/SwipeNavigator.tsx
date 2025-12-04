"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import type { SwipeEventData } from "react-swipeable";

const USER_ORDER = ["/", "/explore", "/cart", "/wishlist", "/profile"] as const;
const ADMIN_ORDER = [
  "/",
  "/explore",
  "/admin/books",
  "/orders",
  "/profile",
] as const;

function getTabIndex(
  pathname: string | null,
  order: readonly string[]
): number {
  if (!pathname) return 0;
  for (let i = 0; i < order.length; i++) {
    const base = order[i];
    if (base === "/" ? pathname === "/" : pathname.startsWith(base)) {
      return i;
    }
  }
  return 0;
}

export default function SwipeNavigator({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = React.useState<"ADMIN" | "USER">("USER");
  const order = role === "ADMIN" ? ADMIN_ORDER : USER_ORDER;
  const index = getTabIndex(pathname, order);
  const [dir, setDir] = React.useState<"left" | "right" | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const j = await res.json();
          if (mounted) setRole(j.role === "ADMIN" ? "ADMIN" : "USER");
        }
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  type WithEvent = SwipeEventData & { event?: Event };
  const shouldBlock = React.useCallback((e: SwipeEventData) => {
    const el = ((e as WithEvent).event?.target as Element) || null;
    if (!el) return false;
    return Boolean(el.closest('[data-swipe-lock="true"]'));
  }, []);

  const onSwipeLeft = React.useCallback(
    (e: SwipeEventData) => {
      if (shouldBlock(e)) return;
      const next = Math.min(index + 1, order.length - 1);
      if (next !== index) {
        setDir("left");
        router.push(order[next]);
      }
    },
    [index, order, router, shouldBlock]
  );

  const onSwipeRight = React.useCallback(
    (e: SwipeEventData) => {
      if (shouldBlock(e)) return;
      const prev = Math.max(index - 1, 0);
      if (prev !== index) {
        setDir("right");
        router.push(order[prev]);
      }
    },
    [index, order, router, shouldBlock]
  );

  const handlers = useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <div {...handlers} className="min-h-screen">
      <div
        key={pathname || "/"}
        className={
          dir === "left"
            ? "swipe-in-left"
            : dir === "right"
            ? "swipe-in-right"
            : ""
        }
      >
        {children}
      </div>
    </div>
  );
}
