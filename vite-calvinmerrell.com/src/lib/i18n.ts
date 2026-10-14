export const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'ja', name: '日本語' },
] as const;

export type Language = (typeof languages)[number]['code'];

const languageCodes = new Set<string>(languages.map(({ code }) => code));

export function isLanguage(value: string | undefined): value is Language {
  return Boolean(value && languageCodes.has(value));
}

export function languageFromPathname(pathname: string): Language {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return isLanguage(firstSegment) ? firstSegment : 'en';
}

export function pathForLanguage(pathname: string, language: Language): string {
  const segments = pathname.split('/').filter(Boolean);
  if (isLanguage(segments[0])) segments.shift();

  const pagePath = segments.length ? `/${segments.join('/')}` : '/';
  const localizedPath = language === 'en' ? pagePath : `/${language}${pagePath}`;
  return pathname.endsWith('/') && !localizedPath.endsWith('/')
    ? `${localizedPath}/`
    : localizedPath;
}

export const messages = {
  en: {
    siteTitle: 'Calvin W. Merrell | Articles',
    siteDescription: 'Articles and notes on technology, computing, and ideas from Calvin W. Merrell.',
    changeLanguage: 'Change language',
    personalBlog: 'Personal blog',
    heroSubtitle: 'Notes on technology, computing, and ideas.',
    heroImageAlt: 'Sunset over the Vernal landscape',
    fromTheBlog: 'From the blog',
    latestArticles: 'Latest articles',
    updated: 'Updated',
    emptyState: 'New articles are on the way.',
    article: 'Article',
    allArticles: 'All articles',
    articleNotFound: 'Article not found',
    articleNotAvailable: 'This article is not available.',
    articleInEnglish: 'This article is currently available in English.',
    returnToAllArticles: 'Return to all articles',
    pageNotFound: 'Page not found',
    pageMoved: 'That page may have moved or the address may be incorrect.',
    loading: 'Loading article…',
  },
  de: {
    siteTitle: 'Calvin W. Merrell | Artikel',
    siteDescription: 'Artikel und Notizen zu Technologie, Informatik und Ideen von Calvin W. Merrell.',
    changeLanguage: 'Sprache ändern',
    personalBlog: 'Persönlicher Blog',
    heroSubtitle: 'Notizen zu Technologie, Informatik und Ideen.',
    heroImageAlt: 'Sonnenuntergang über der Landschaft bei Vernal',
    fromTheBlog: 'Aus dem Blog',
    latestArticles: 'Neueste Artikel',
    updated: 'Aktualisiert',
    emptyState: 'Neue Artikel folgen in Kürze.',
    article: 'Artikel',
    allArticles: 'Alle Artikel',
    articleNotFound: 'Artikel nicht gefunden',
    articleNotAvailable: 'Dieser Artikel ist derzeit nicht verfügbar.',
    articleInEnglish: 'Dieser Artikel ist derzeit auf Englisch verfügbar.',
    returnToAllArticles: 'Zurück zu allen Artikeln',
    pageNotFound: 'Seite nicht gefunden',
    pageMoved: 'Diese Seite wurde möglicherweise verschoben oder die Adresse ist falsch.',
    loading: 'Artikel wird geladen…',
  },
  es: {
    siteTitle: 'Calvin W. Merrell | Artículos',
    siteDescription: 'Artículos y notas sobre tecnología, informática e ideas de Calvin W. Merrell.',
    changeLanguage: 'Cambiar idioma',
    personalBlog: 'Blog personal',
    heroSubtitle: 'Notas sobre tecnología, informática e ideas.',
    heroImageAlt: 'Atardecer sobre el paisaje de Vernal',
    fromTheBlog: 'Del blog',
    latestArticles: 'Artículos recientes',
    updated: 'Actualizado',
    emptyState: 'Pronto habrá nuevos artículos.',
    article: 'Artículo',
    allArticles: 'Todos los artículos',
    articleNotFound: 'Artículo no encontrado',
    articleNotAvailable: 'Este artículo no está disponible.',
    articleInEnglish: 'Este artículo está disponible actualmente en inglés.',
    returnToAllArticles: 'Volver a todos los artículos',
    pageNotFound: 'Página no encontrada',
    pageMoved: 'Es posible que la página se haya movido o que la dirección sea incorrecta.',
    loading: 'Cargando artículo…',
  },
  ja: {
    siteTitle: 'Calvin W. Merrell | 記事',
    siteDescription: 'Calvin W. Merrellによるテクノロジー、コンピューティング、アイデアに関する記事とメモ。',
    changeLanguage: '言語を変更',
    personalBlog: '個人ブログ',
    heroSubtitle: 'テクノロジー、コンピューティング、アイデアに関するメモ。',
    heroImageAlt: 'バーナルの風景に沈む夕日',
    fromTheBlog: 'ブログより',
    latestArticles: '最新の記事',
    updated: '更新日',
    emptyState: '新しい記事を準備中です。',
    article: '記事',
    allArticles: 'すべての記事',
    articleNotFound: '記事が見つかりません',
    articleNotAvailable: 'この記事は現在ご利用いただけません。',
    articleInEnglish: 'この記事は現在英語で公開されています。',
    returnToAllArticles: 'すべての記事に戻る',
    pageNotFound: 'ページが見つかりません',
    pageMoved: 'ページが移動したか、アドレスが正しくない可能性があります。',
    loading: '記事を読み込んでいます…',
  },
} satisfies Record<Language, Record<string, string>>;

export const dateLocales: Record<Language, string> = {
  en: 'en-US',
  de: 'de-DE',
  es: 'es-ES',
  ja: 'ja-JP',
};

export const localizedPostDetails: Record<
  Exclude<Language, 'en'>,
  Record<string, { title: string; description: string }>
> = {
  de: {
    'my-first-article': {
      title: 'Mein erster Artikel',
      description: 'Dies ist mein erster Artikel.',
    },
    'quantum-computing': {
      title: 'Wie sollten Informatikstudiengänge Quantencomputing einführen?',
      description:
        'Dieser Bericht vergleicht vier Ansätze für Quantencomputing im Bachelorstudium und empfiehlt ein praxisorientiertes Software-Wahlfach.',
    },
  },
  es: {
    'my-first-article': {
      title: 'Mi primer artículo',
      description: 'Este es mi primer artículo.',
    },
    'quantum-computing': {
      title: '¿Cómo deberían enseñar los programas universitarios de informática la computación cuántica?',
      description:
        'Este informe compara cuatro enfoques para enseñar computación cuántica a estudiantes universitarios y recomienda una asignatura optativa práctica basada en software.',
    },
  },
  ja: {
    'my-first-article': {
      title: '最初の記事',
      description: 'これが私の最初の記事です。',
    },
    'quantum-computing': {
      title: '学部のコンピューターサイエンスでは量子コンピューティング入門をどう教えるべきか',
      description:
        '本レポートでは、学部生に量子コンピューティングを教える4つの方法を比較し、実践的なソフトウェア中心の選択科目を提案します。',
    },
  },
};

export function postInLanguage<T extends { slug: string; title: string; description: string }>(
  post: T,
  language: Language,
): T {
  if (language === 'en') return post;
  const details = localizedPostDetails[language][post.slug];
  return details ? { ...post, ...details } : post;
}
