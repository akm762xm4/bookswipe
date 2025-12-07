import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BottomBar } from "./components/BottomBar";
import DesktopSidebar from "./components/DesktopSidebar";
import PageHeader from "./components/PageHeader";
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
            <main className="px-6 py-6 max-w-5xl">{children}</main>
          </div>
        </div>

        {/* Mobile layout: Header + Content + BottomBar */}
        <div className="md:hidden">
          <main className="px-4 py-4">{children}</main>
          <BottomBar />
        </div>
      </body>
    </html>
  );
}
