import type { PostSummary } from "../shared/blog-types";

export function indexHead(): string {
  return `
  <title>Блог — maxima consulting</title>
  <meta name="description" content="Статьи о НДС, управленческом учёте и финансах для собственников МСБ." />
  <link rel="canonical" href="https://maxima-consulting.ru/blog/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Блог — maxima consulting" />
  <meta property="og:url" content="https://maxima-consulting.ru/blog/" />
`;
}

export function postHead(post: PostSummary): string {
  const canonical =
    post.canonicalUrl ?? `https://maxima-consulting.ru/blog/${post.slug}/`;
  const ogImage = post.ogImage ?? post.coverImage;
  const imageUrl = ogImage.startsWith("http")
    ? ogImage
    : `https://maxima-consulting.ru${ogImage}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author },
    image: imageUrl,
    mainEntityOfPage: canonical,
  };
  return `
  <title>${escapeHtml(post.title)} — maxima consulting</title>
  <meta name="description" content="${escapeAttr(post.description)}" />
  <link rel="canonical" href="${escapeAttr(canonical)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeAttr(post.title)}" />
  <meta property="og:description" content="${escapeAttr(post.description)}" />
  <meta property="og:url" content="${escapeAttr(canonical)}" />
  <meta property="og:image" content="${escapeAttr(imageUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
`;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s: string) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}
