"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";

const TAB_ORDER = ["/", "/explore", "/cart", "/wishlist", "/profile"] as const;

function getTabIndex(pathname: string | null): number {
  if (!pathname) return 0;
  for (let i = 0; i < TAB_ORDER.length; i++) {
    const base = TAB_ORDER[i];
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
  const index = getTabIndex(pathname);

  const onSwipeLeft = React.useCallback(() => {
    const next = Math.min(index + 1, TAB_ORDER.length - 1);
    if (next !== index) router.push(TAB_ORDER[next]);
  }, [index, router]);

  const onSwipeRight = React.useCallback(() => {
    const prev = Math.max(index - 1, 0);
    if (prev !== index) router.push(TAB_ORDER[prev]);
  }, [index, router]);

  const handlers = useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <div {...handlers} className="min-h-screen">
      {children}
    </div>
  );
}
