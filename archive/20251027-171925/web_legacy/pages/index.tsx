import { useState } from 'react';
import Head from 'next/head';
import GenreSelector from '@/components/GenreSelector';
import StoryOutput from '@/components/StoryOutput';
import Spinner from '@/components/Spinner';
import { generateScene } from '@/lib/api';

export default function Home() {
  const [genre, setGenre] = useState('romcom');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState<string[] | string>('');
  const [script, setScript] = useState('');
  const [error, setError] = useState('');

  const onGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await generateScene(genre);
      setTitle(res.title || '');
      setNotes(res.director_notes || []);
      setScript(res.script || '');
    } catch (e: any) {
      setError(e?.message || 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-night-900 bg-stars-gradient text-slate-100">
      <Head>
        <title>SeoulScript</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white drop-shadow" style={{textShadow:'0 0 20px rgba(139,128,249,0.25)'}}>
            SeoulScript
          </h1>
          <p className="mt-2 text-slate-300">Dreamy K-drama mini-scenes. Pick a genre and generate.</p>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 shadow-glow">
          <GenreSelector value={genre} onChange={setGenre} />

          <button
            onClick={onGenerate}
            className="mt-4 w-full rounded-xl bg-violet-500/90 hover:bg-violet-500 text-white py-3 font-medium shadow-glow transition"
            disabled={loading}
          >
            {loading ? 'Generating…' : 'Generate Script'}
          </button>

          {loading && (
            <div className="mt-6 flex items-center justify-center"><Spinner /></div>
          )}

          {error && (
            <div className="mt-6 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-200 text-sm">{error}</div>
          )}

          {(title || script) && !loading && (
            <div className="mt-8">
              <StoryOutput title={title} notes={notes} script={script} />
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-xs text-slate-400">
          Made with stars and stories ✨
        </footer>
      </div>
    </div>
  );
}
