export const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'ja', name: '日本語' },
  { code: 'ru', name: 'Русский' },
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
    games: 'Games',
    art: 'Art Studio',
    personalBlog: '“Either write something worth reading or do something worth writing" ― Benjamin Franklin',
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
    returnToAllArticles: 'Return to all articles',
    pageNotFound: 'Page not found',
    pageMoved: 'That page may have moved or the address may be incorrect.',
    loading: 'Loading article…',
  },
  de: {
    siteTitle: 'Calvin W. Merrell | Artikel',
    siteDescription: 'Artikel und Notizen zu Technologie, Informatik und Ideen von Calvin W. Merrell.',
    changeLanguage: 'Sprache ändern',
    games: 'Spiele',
    art: 'Kunststudio',
    personalBlog: '„Schreibe entweder etwas, das lesenswert ist, oder tue etwas, worüber es sich zu schreiben lohnt.“ ― Benjamin Franklin',
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
    returnToAllArticles: 'Zurück zu allen Artikeln',
    pageNotFound: 'Seite nicht gefunden',
    pageMoved: 'Diese Seite wurde möglicherweise verschoben oder die Adresse ist falsch.',
    loading: 'Artikel wird geladen…',
  },
  es: {
    siteTitle: 'Calvin W. Merrell | Artículos',
    siteDescription: 'Artículos y notas sobre tecnología, informática e ideas de Calvin W. Merrell.',
    changeLanguage: 'Cambiar idioma',
    games: 'Juegos',
    art: 'Estudio de arte',
    personalBlog: '«Escribe algo que merezca la pena leer o haz algo que merezca la pena escribir». ― Benjamin Franklin',
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
    returnToAllArticles: 'Volver a todos los artículos',
    pageNotFound: 'Página no encontrada',
    pageMoved: 'Es posible que la página se haya movido o que la dirección sea incorrecta.',
    loading: 'Cargando artículo…',
  },
  ja: {
    siteTitle: 'Calvin W. Merrell | 記事',
    siteDescription: 'Calvin W. Merrellによるテクノロジー、コンピューティング、アイデアに関する記事とメモ。',
    changeLanguage: '言語を変更',
    games: 'ゲーム',
    art: 'アートスタジオ',
    personalBlog: '「読む価値のあるものを書くか、書く価値のあることをするか。」― ベンジャミン・フランクリン',
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
    returnToAllArticles: 'すべての記事に戻る',
    pageNotFound: 'ページが見つかりません',
    pageMoved: 'ページが移動したか、アドレスが正しくない可能性があります。',
    loading: '記事を読み込んでいます…',
  },
  ru: {
    siteTitle: 'Кэлвин У. Меррелл | Статьи',
    siteDescription: 'Статьи и заметки о технологиях, информатике и идеях от Кэлвина У. Меррелла.',
    changeLanguage: 'Выбрать язык',
    games: 'Игры',
    art: 'Арт-студия',
    personalBlog: '«Либо напиши то, что стоит прочитать, либо сделай то, о чём стоит написать». ― Бенджамин Франклин',
    heroSubtitle: 'Заметки о технологиях, информатике и идеях.',
    heroImageAlt: 'Закат над окрестностями Вернала',
    fromTheBlog: 'Из блога',
    latestArticles: 'Последние статьи',
    updated: 'Обновлено',
    emptyState: 'Скоро появятся новые статьи.',
    article: 'Статья',
    allArticles: 'Все статьи',
    articleNotFound: 'Статья не найдена',
    articleNotAvailable: 'Эта статья сейчас недоступна.',
    returnToAllArticles: 'Вернуться ко всем статьям',
    pageNotFound: 'Страница не найдена',
    pageMoved: 'Возможно, страница перемещена или адрес указан неверно.',
    loading: 'Загрузка статьи…',
  },
} satisfies Record<Language, Record<string, string>>;

export const dateLocales: Record<Language, string> = {
  en: 'en-US',
  de: 'de-DE',
  es: 'es-ES',
  ja: 'ja-JP',
  ru: 'ru-RU',
};
