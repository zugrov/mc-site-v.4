export function CTA() {
  return (
    <div className="my-10 rounded-xl border border-teal-500/30 bg-teal-950/30 p-6">
      <p className="text-lg font-semibold font-[family-name:var(--font-display)]">
        Первый разбор — бесплатно
      </p>
      <p className="mt-2 text-sm text-[#9da29b]">
        30 минут, без обязательств. Разберём вашу ситуацию и дадим первые рекомендации.
      </p>
      <a
        href="https://maxima-consulting.ru/#contact"
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#0d9488] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f766e]"
      >
        Записаться на разбор →
      </a>
    </div>
  );
}
