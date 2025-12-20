import { motion } from 'framer-motion';

type Props = {
  title?: string;
  notes?: string[] | string;
  script?: string;
  onCopy?: () => void;
  onReset?: () => void;
};

export default function StoryCard({ title, notes, script, onCopy, onReset }: Props) {
  const noteList = Array.isArray(notes) ? notes : (notes ? [notes] : []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-5 shadow-glow"
    >
      {!!title && (
        <h2 className="text-2xl font-display text-white mb-2">{title}</h2>
      )}

      {!!noteList.length && (
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-wide text-silver/70 mb-1">Director’s Notes</h3>
          <ul className="list-disc list-inside space-y-1 text-silver/90 text-sm">
            {noteList.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      )}

      {!!script && (
        <pre className="font-script text-silver/95 text-sm leading-6 whitespace-pre-wrap">{script}</pre>
      )}

      <div className="mt-5 flex gap-2">
        <button onClick={onCopy} className="px-3 py-2 rounded-lg bg-neon-purple/30 hover:bg-neon-purple/40 text-white text-sm">Copy</button>
        <button onClick={onReset} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-silver text-sm">Reset</button>
      </div>
    </motion.div>
  );
}
