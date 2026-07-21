// i18n foundation — OpsFlow (FR default, auto-detect via Accept-Language)
// Wired by middleware + app/[lang] routing (see feat/i18n plan).
export const locales = ['fr', 'de', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

/** Pick the best supported locale from an Accept-Language header (browser pref). */
export function resolveLocale(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) return defaultLocale
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { base: tag.toLowerCase().split('-')[0], q: q ? parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  for (const { base } of ranked) {
    if ((locales as readonly string[]).includes(base)) return base as Locale
  }
  return defaultLocale
}
