const colors = [
  'bg-orange-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-pink-500',
  'bg-blue-500',
  'bg-purple-500',
];

function fmtTime(seconds) {
  if (!seconds && seconds !== 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function VideoChapterBar({ segments = [], duration = 0, currentTime = 0, onSeek }) {
  if (!segments.length || !duration) return null;

  const activeIndex = segments.reduce((acc, segment, index) => (currentTime >= segment.startTime ? index : acc), 0);

  return (
    <div className="pointer-events-none absolute bottom-[72px] left-0 right-0 z-30 bg-gradient-to-b from-transparent to-black/85 px-4 pb-2.5 pt-7">
      <div className="pointer-events-auto mb-1.5 grid auto-cols-fr grid-flow-col gap-0.5">
        {segments.map((segment, index) => {
          const active = index === activeIndex;
          return (
            <button key={`${segment.startTime}-${segment.topic}`} type="button" onClick={() => onSeek?.(segment.startTime)} className="min-w-0 text-left">
              <span className={`block truncate px-0.5 text-[10px] font-semibold ${active ? 'text-accent' : 'text-white/55'}`}>{segment.startLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="pointer-events-auto grid h-2 grid-flow-col gap-0.5 overflow-hidden rounded-full bg-white/10">
        {segments.map((segment, index) => (
          <button
            key={`${segment.topic}-${index}`}
            type="button"
            onClick={() => onSeek?.(segment.startTime)}
            title={`${segment.topic} (${fmtTime(segment.startTime)})`}
            className={`${colors[index % colors.length]} opacity-60 transition hover:opacity-100 ${index === activeIndex ? 'opacity-100' : ''}`}
          />
        ))}
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="truncate">{segments[activeIndex]?.topic}</span>
        <span className="ml-auto font-mono text-[10px] text-white/40">{fmtTime(currentTime)} / {fmtTime(duration)}</span>
      </div>
    </div>
  );
}
