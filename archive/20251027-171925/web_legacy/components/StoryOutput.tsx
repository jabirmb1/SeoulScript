import React from 'react';

type Props = {
  title: string;
  notes: string[] | string;
  script: string;
};

export default function StoryOutput({ title, notes, script }: Props) {
  const noteList = Array.isArray(notes) ? notes : (notes ? [notes] : []);
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-5">
      {title && <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>}
      {!!noteList.length && (
        <div className="mb-4">
          <h3 className="text-sm uppercase tracking-wide text-slate-400">Director's Notes</h3>
          <ul className="mt-2 list-disc list-inside space-y-1 text-slate-200 text-sm">
            {noteList.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      )}
      {script && (
        <div className="prose prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0">
          <article className="whitespace-pre-wrap font-mono text-slate-200 text-sm leading-6">{script}</article>
        </div>
      )}
    </div>
  );
}
