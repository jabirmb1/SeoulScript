"use client";

import { motion } from "framer-motion";

interface GenreSelectorProps {
  onSelect: (genre: string) => void;
}

const genres = [
  { name: "Romance", emoji: "💕", color: "from-pink-500 to-rose-500" },
  { name: "Melodrama", emoji: "😢", color: "from-purple-500 to-indigo-500" },
  { name: "Comedy", emoji: "😄", color: "from-yellow-500 to-orange-500" },
  { name: "Thriller", emoji: "🔪", color: "from-red-500 to-rose-500" },
  { name: "Fantasy", emoji: "✨", color: "from-blue-500 to-cyan-500" },
  { name: "Historical", emoji: "🏛️", color: "from-amber-500 to-yellow-500" },
];

export default function GenreSelector({ onSelect }: GenreSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {genres.map((genre, index) => (
        <motion.button
          key={genre.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -8 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(genre.name)}
          className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg p-8 text-center hover:border-violet-500/50 transition-all"
        >
          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
          
          <div className="relative z-10">
            <div className="text-6xl mb-4">{genre.emoji}</div>
            <h3 className="text-2xl font-bold text-slate-100 mb-2">
              {genre.name}
            </h3>
            <p className="text-slate-400 text-sm">
              Click to generate
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}