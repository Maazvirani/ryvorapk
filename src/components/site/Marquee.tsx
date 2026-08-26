export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border bg-surface py-4">
      <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="eyebrow flex items-center gap-12 text-foreground/60">
            {item}
            <span className="h-1 w-1 rounded-full bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}
