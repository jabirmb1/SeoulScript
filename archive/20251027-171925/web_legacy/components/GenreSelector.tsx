type Props = {
  value: string;
  onChange: (v: string) => void;
};

const options = [
  { value: 'romcom', label: 'Romcom' },
  { value: 'melodrama', label: 'Melodrama' },
  { value: 'fantasy_supernatural', label: 'Fantasy / Supernatural' },
  { value: 'action_thriller', label: 'Action / Thriller' },
];

export default function GenreSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-slate-300">Genre</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-night-800 border border-white/10 px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
