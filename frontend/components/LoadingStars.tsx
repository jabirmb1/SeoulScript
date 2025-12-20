"use client";

import { motion } from "framer-motion";

export default function LoadingStars() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-violet-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <p className="text-slate-400 text-sm">Loading stories...</p>
    </div>
  );
}