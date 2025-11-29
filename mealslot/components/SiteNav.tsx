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
              className="rounded-full border border-neutral-200 bg-[#f0ece6] px-4 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-[#e9e4dd] shadow-sm dark:border-[#303237] dark:bg-[#26282d] dark:text-neutral-200 dark:hover:bg-[#303237] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
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
              className="rounded-full border border-neutral-200 bg-[#f0ece6] px-4 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-[#e9e4dd] shadow-sm dark:border-[#303237] dark:bg-[#26282d] dark:text-neutral-200 dark:hover:bg-[#303237] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
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
