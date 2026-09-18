export type TocItem = { id: string; text: string; level: number };

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 3) return null;
  return (
    <nav className="rounded-lg border border-[var(--line)] bg-[#111313] p-4 text-sm">
      <p className="mb-3 text-xs uppercase tracking-wider text-[#6b7280]">Содержание</p>
      <ol className="space-y-2 list-none m-0 p-0">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
            <a href={`#${item.id}`} className="text-[#bfc2ba] hover:text-teal-300">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
