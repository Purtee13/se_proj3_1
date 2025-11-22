// --- path: components/SiteNav.tsx ---
"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth-context";

export default function SiteNav() {
  const { user, logout } = useAuth();

  return (
    <nav className="relative z-50 mx-auto flex max-w-6xl items-center justify-between px-4 py-3 pointer-events-auto">
      <div className="flex items-center gap-6">
        <Link href="/" prefetch className="font-semibold hover:underline">
          Home
        </Link>
        <Link href="/party" prefetch className="hover:underline">
          Party Mode
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {user.username}
            </span>
            <button
              onClick={logout}
              className="text-sm hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm hover:underline">
              Login
            </Link>
            <Link href="/signup" className="text-sm hover:underline">
              Sign Up
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
