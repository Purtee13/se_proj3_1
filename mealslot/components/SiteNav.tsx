// --- path: components/SiteNav.tsx ---
"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";

export default function SiteNav() {
  const { user, logout } = useAuth();

  return (
    <nav className="relative z-50 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 pointer-events-auto">
      <div className="flex items-center gap-6">
        <Link 
          href="/home" 
          prefetch 
          className="text-lg font-bold text-neutral-900 transition-colors hover:text-orange-600 dark:text-neutral-100 dark:hover:text-orange-400"
        >
          🎰 MealSlot
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            href="/home" 
            prefetch 
            className="text-sm font-medium text-neutral-700 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-400"
          >
            Home
          </Link>
          <Link 
            href="/party" 
            prefetch 
            className="text-sm font-medium text-neutral-700 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-400"
          >
            Party Mode
          </Link>
            <Link 
              href="/tried" 
              prefetch 
              className="text-sm font-medium text-neutral-700 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-400"
            >
              Tried Dishes
            </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              👤 {user.username}
            </span>
            <motion.button
              onClick={logout}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <Link 
              href="/login" 
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700"
            >
              Sign Up
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
