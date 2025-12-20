"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GenreSelector from "@/components/GenreSelector";
import LoadingStars from "@/components/LoadingStars";

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<"genre" | "generated" | "editing">("genre");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState("");
  
  // Story fields
  const [title, setTitle] = useState("");
  const [directorsNote, setDirectorsNote] = useState("");
  const [script, setScript] = useState("");

  useEffect(() => {
    // Get or create user ID
    let id = localStorage.getItem("seoulscript_user_id");
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("seoulscript_user_id", id);
    }
    setUserId(id);
  }, []);

  const handleGenerate = async (genre: string) => {
    setSelectedGenre(genre);
    setGenerating(true);

    try {
      const response = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre }),
      });

      const data = await response.json();
      
      setTitle(data.title);
      setDirectorsNote(data.directors_note);
      setScript(data.script);
      setStep("generated");
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate story. Make sure Ollama is running!");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch("http://localhost:8000/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          title,
          genre: selectedGenre,
          directors_note: directorsNote,
          script,
        }),
      });

      const data = await response.json();
      router.push(`/story/${data.id}`);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save story. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (generating) {
    return (
      <div className="container mx-auto px-4 py-20">
        <LoadingStars />
        <p className="text-center text-slate-400 mt-4">
          Crafting your story under Seoul stars...
        </p>
      </div>
    );
  }

  if (step === "genre") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 glow-text">
            Choose Your Genre
          </h1>
          <p className="text-slate-400 text-lg">
            Let AI weave a K-drama tale for you to remix
          </p>
        </div>

        <GenreSelector onSelect={handleGenerate} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 glow-text">Edit Your Story</h1>
          <p className="text-slate-400">Make it yours before publishing</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Director's Note */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Director's Note
            </label>
            <textarea
              value={directorsNote}
              onChange={(e) => setDirectorsNote(e.target.value)}
              rows={3}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
            />
          </div>

          {/* Script */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Script</label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={15}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 font-mono text-sm focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setStep("genre")}
              className="px-6 py-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all"
            >
              Start Over
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-violet-600 rounded-lg hover:bg-violet-700 transition-all glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Publishing..." : "Publish Story"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}