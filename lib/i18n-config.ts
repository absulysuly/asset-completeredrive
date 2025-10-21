export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ar', 'ku'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
