import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` is a Promise in next-intl v4 — must be awaited
  const requested = await requestLocale;

  // Validate that the incoming locale is valid, default to 'en' if not
  const locale = requested && routing.locales.includes(requested as any)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
