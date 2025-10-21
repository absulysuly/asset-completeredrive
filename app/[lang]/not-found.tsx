import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import { Locale, i18n } from '@/lib/i18n-config';
import { headers } from 'next/headers';

// This function is a workaround to get the language from the path in a not-found component.
function getLang(): Locale {
    const headersList = headers();
    const pathname = headersList.get('x-next-pathname') || '';
    const lang = pathname.split('/')[1] as Locale;
    return i18n.locales.includes(lang) ? lang : i18n.defaultLocale;
}

export default async function NotFound() {
  const lang = getLang();
  const dictionary = await getDictionary(lang);
  
  return (
    <div className="flex h-full flex-grow flex-col items-center justify-center text-center">
      <h2 className="mb-4 text-4xl font-bold">{dictionary.notFound.title}</h2>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">{dictionary.notFound.description}</p>
      <Link href={`/${lang}`} className="rounded-md bg-green-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-green-700">
        {dictionary.notFound.returnHome}
      </Link>
    </div>
  );
}
