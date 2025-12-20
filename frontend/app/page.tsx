"use client";

import { useEffect, useState } from "react";
import StoryCard from "@/components/StoryCard";
import LoadingStars from "@/components/LoadingStars";

interface Story {
  id: string;
  title: string;
  genre: string;
  preview: string;
  view_count: number;
  created_at: string;
  pen_name?: string;
}

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const genres = ["Romance", "Melodrama", "Comedy", "Thriller", "Fantasy", "Historical"];

  useEffect(() => {
    loadStories();
  }, [page, selectedGenre]);

  const loadStories = async () => {
    setLoading(true);
    try {
      const genreParam = selectedGenre ? `&genre=${selectedGenre}` : "";
      const response = await fetch(
        `http://localhost:8000/api/stories?page=${page}&limit=20${genreParam}`
      );
      const data = await response.json();
      setStories(data.stories);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to load stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreFilter = (genre: string | null) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  if (loading && stories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <LoadingStars />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-4 glow-text">
          Stories Written Under Seoul Stars
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Short-form K-drama fanfiction, crafted by AI and remixed by dreamers.
        </p>
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-3 mb-12 justify-center">
        <button
          onClick={() => handleGenreFilter(null)}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedGenre === null
              ? "bg-violet-600 text-white glow"
              : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
          }`}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreFilter(genre)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedGenre === genre
                ? "bg-violet-600 text-white glow"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      {stories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">
            No stories yet. Be the first to create one! ✨
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-2 bg-slate-800/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-all"
          >
            Previous
          </button>
          <span className="px-6 py-2 text-slate-400">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 20)}
            className="px-6 py-2 bg-slate-800/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}