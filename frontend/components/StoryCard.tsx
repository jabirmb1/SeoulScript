"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface StoryCardProps {
  story: {
    id: string;
    title: string;
    genre: string;
    preview: string;
    view_count: number;
    pen_name?: string;
  };
}

export default function StoryCard({ story }: StoryCardProps) {
  const genreColors: Record<string, string> = {
    Romance: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    Melodrama: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Comedy: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Thriller: "bg-red-500/20 text-red-300 border-red-500/30",
    Fantasy: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Historical: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };

  return (
    <Link href={`/story/${story.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg p-6 h-full cursor-pointer hover:border-violet-500/50 transition-all"
      >
        {/* Genre Tag */}
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-4 ${genreColors[story.genre] || "bg-slate-500/20 text-slate-300"}`}>
          {story.genre}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-slate-100 line-clamp-2">
          {story.title}
        </h3>

        {/* Preview */}
        <p className="text-slate-400 text-sm mb-4 line-clamp-4 font-mono">
          {story.preview}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
          <span>{story.pen_name || "Anonymous"}</span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {story.view_count}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}