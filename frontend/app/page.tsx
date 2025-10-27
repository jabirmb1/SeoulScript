"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import GenreSelector from '@/components/GenreSelector';
import LoadingStars from '@/components/LoadingStars';
import StoryCard from '@/components/StoryCard';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

type ApiResponse = {
  title: string;
  genre: string;
  director_notes: string[] | string;
  scene_script: string;
};

export default function Page() {
  const [genre, setGenre] = useState('romcom');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState<string[] | string>('');
  const [script, setScript] = useState('');

  const onGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Request failed');
      }
      const data: ApiResponse = await res.json();
      setTitle(data.title || '');
      setNotes(data.director_notes || []);
      setScript(data.scene_script || '');
    } catch (e: any) {
      setError(e?.message || 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title ? title + "\n\n" : ''}${Array.isArray(notes) ? notes.join('\n') : (notes || '')}${notes ? '\n\n' : ''}${script}`);
    } catch {}
  };

  const onReset = () => {
    setTitle('');
    setNotes('');
    setScript('');
    setError('');
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Header />

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 shadow-glow">
        <p className="mb-3 text-silver/80 text-sm">Select your genre to begin…</p>
        <GenreSelector value={genre} onChange={setGenre} />

        <button
          onClick={onGenerate}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-neon-purple/40 hover:bg-neon-purple/50 text-white py-3 font-medium shadow-glow transition"
        >
          🎬 Generate Scene
        </button>

        {loading && <LoadingStars />}
        {error && <div className="mt-6 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-200 text-sm">{error}</div>}

        {(title || script) && !loading && (
          <StoryCard title={title} notes={notes} script={script} onCopy={onCopy} onReset={onReset} />
        )}
      </div>

      <footer className="mt-10 text-center text-xs text-silver/70">SeoulScript • Night skies and stories ✨</footer>
    </main>
  );
}
