import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MobileNavbar from "./components/MobileNavbar";
import { BottomBar } from "./components/BottomBar";
import SwipeNavigator from "./components/SwipeNavigator";
import DesktopSidebar from "./components/DesktopSidebar";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookSwipe",
  description: "Swipe, tap, and get your next read",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100`}>
        {/* Desktop layout: Sidebar + Header + Main */}
        <div className="hidden md:grid md:grid-cols-[16rem_1fr] min-h-screen">
          <DesktopSidebar />
          <div className="flex flex-col">
            {/* Desktop top header: large search bar */}
            <div className="sticky top-0 z-30 bg-gradient-to-b from-black/20 to-transparent backdrop-blur-md border-b border-white/10">
              <div className="px-6 py-4">
                <DesktopSearchBar />
              </div>
            </div>
            <main className="px-6 py-6 max-w-5xl">{children}</main>
          </div>
        </div>

        {/* Mobile layout: Navbar + Content + BottomBar */}
        <div className="md:hidden">
          <MobileNavbar />
          <SwipeNavigator>
            <main className="px-4 py-4">{children}</main>
          </SwipeNavigator>
          <BottomBar />
        </div>
      </body>
    </html>
  );
}

function DesktopSearchBar() {
  return (
    <div className="flex items-center gap-2">
      <input
        placeholder="Search books..."
        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/50 focus:outline-none"
      />
      <button className="px-4 py-3 rounded-xl bg-white/15 border border-white/25 text-sm">Search</button>
    </div>
  );
}
