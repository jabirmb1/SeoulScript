"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingStars from "@/components/LoadingStars";
import { motion } from "framer-motion";

interface Story {
  id: string;
  title: string;
  genre: string;
  directors_note: string;
  script: string;
  view_count: number;
  created_at: string;
  pen_name?: string;
}

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadStory();
  }, [params.id]);

  const loadStory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/stories/${params.id}`);
      if (!response.ok) throw new Error("Story not found");
      const data = await response.json();
      setStory(data);
    } catch (error) {
      console.error("Failed to load story:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <LoadingStars />
      </div>
    );
  }

  if (!story) return null;

  const genreColors: Record<string, string> = {
    Romance: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    Melodrama: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Comedy: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Thriller: "bg-red-500/20 text-red-300 border-red-500/30",
    Fantasy: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Historical: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Feed
        </button>

        {/* Story Header */}
        <div className="mb-12 text-center">
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border mb-6 ${genreColors[story.genre]}`}>
            {story.genre}
          </div>
          
          <h1 className="text-5xl font-bold mb-4 glow-text">
            {story.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-slate-400 text-sm">
            <span>By {story.pen_name || "Anonymous"}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {story.view_count} views
            </span>
          </div>
        </div>

        {/* Director's Note */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg p-8 mb-8">
          <h2 className="text-sm uppercase tracking-wider text-violet-400 mb-3">
            Director's Note
          </h2>
          <p className="text-slate-300 italic leading-relaxed">
            {story.directors_note}
          </p>
        </div>

        {/* Script */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg p-8 mb-8">
          <pre className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {story.script}
          </pre>
        </div>

        {/* Share Button */}
        <div className="flex justify-center">
          <button
            onClick={handleShare}
            className="px-8 py-3 bg-violet-600 rounded-lg hover:bg-violet-700 transition-all glow flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {copied ? "Link Copied!" : "Share Story"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}