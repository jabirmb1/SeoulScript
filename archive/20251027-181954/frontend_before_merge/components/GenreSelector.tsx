type Props = {
  value: string;
  onChange: (v: string) => void;
};

const GENRES = [
  { value: 'romcom', label: 'Romcom' },
  { value: 'melodrama', label: 'Melodrama' },
  { value: 'fantasy_supernatural', label: 'Fantasy' },
  { value: 'action_thriller', label: 'Action' },
  { value: 'horror', label: 'Horror' },
  { value: 'comedy', label: 'Comedy' },
];

export default function GenreSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {GENRES.map(g => (
        <button
          key={g.value}
          onClick={() => onChange(g.value)}
          className={`px-3 py-2 rounded-xl border transition shadow-glow ${value===g.value ? 'bg-neon-purple/20 border-neon-purple/60' : 'bg-white/5 border-white/10 hover:border-neon-purple/40'}`}
        >
          <span className="text-silver/90 text-sm">{g.label}</span>
        </button>
      ))}
    </div>
  );
}
