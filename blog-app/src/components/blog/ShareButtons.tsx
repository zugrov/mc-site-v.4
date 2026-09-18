export function ShareButtons({ url, title }: { url: string; title: string }) {
  const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-wrap gap-3 items-center text-sm">
      <span className="text-[#6b7280]">Поделиться:</span>
      <a
        href={tg}
        target="_blank"
        rel="noopener noreferrer"
        className="text-teal-300 hover:underline"
      >
        Telegram
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="text-teal-300 hover:underline bg-transparent border-0 cursor-pointer p-0 font-inherit"
      >
        Скопировать ссылку
      </button>
    </div>
  );
}
