// --- path: app/(site)/layout.tsx ---
"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SiteNav from "@/components/SiteNav";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/" || pathname === "/login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {!isLandingPage && (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
          <SiteNav />
        </header>
      )}
      <main className={isLandingPage ? "" : "mx-auto max-w-6xl px-4 py-6"}>{children}</main>
    </div>
  );
}
