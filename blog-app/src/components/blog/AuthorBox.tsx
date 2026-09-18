export function AuthorBox() {
  return (
    <aside className="rounded-xl border border-[var(--line)] bg-[#111313] p-5 flex gap-4">
      <img
        src="/images/blog/author-maxim.jpg"
        alt="Максим Зугров"
        width={72}
        height={72}
        className="rounded-lg object-cover w-[72px] h-[72px]"
        loading="lazy"
      />
      <div>
        <p className="font-semibold">Максим Зугров</p>
        <p className="mt-1 text-sm text-[#9da29b] leading-relaxed">
          Финансовый консультант для МСБ. Помогаю собственникам видеть цифры, снижать
          налоговые риски и принимать решения на основе данных — не интуиции.
        </p>
      </div>
    </aside>
  );
}
