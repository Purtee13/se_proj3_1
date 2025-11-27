"use client";

import React from "react"
import { Dish } from "@/lib/schemas";
import { cn } from "./ui/cn";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  dish?: Dish;
  reelIndex?: number;
  locked: boolean;
  onToggle(): void;
  isSpinning?: boolean;
  isRevealing?: boolean;
};

export default function SlotReel({ dish, reelIndex, locked, onToggle, isSpinning = false, isRevealing = false }: Props) {
  return (
    <motion.div
      className="flex h-48 w-full flex-col justify-between rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      initial={false}
      animate={{
        scale: isRevealing && dish ? 1.05 : 1,
        boxShadow: isRevealing && dish 
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <div className="min-h-16 overflow-hidden">
        <AnimatePresence mode="wait">
          {isSpinning ? (
            <motion.div
              key="spinning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                y: [0, -10, 0],
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                opacity: {
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                y: {
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="text-base font-semibold text-neutral-400"
            >
              Spinning...
            </motion.div>
          ) : dish ? (
            <motion.div
              key={`${dish.id}_${reelIndex ?? ""}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: isRevealing ? [1, 1.1, 1] : 1,
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                opacity: { duration: 0.3 },
              }}
            >
              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {dish.name}
              </div>
              <div className="mt-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                {dish.category}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-base font-semibold text-neutral-300 dark:text-neutral-700"
            >
              —
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.button
        className={cn(
          "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
          locked 
            ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100" 
            : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-700"
        )}
        onClick={onToggle}
        aria-pressed={locked}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSpinning || !dish}
      >
        {locked ? "🔒 Locked" : "🔓 Lock"}
      </motion.button>
    </motion.div>
  );
}
