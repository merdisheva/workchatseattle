import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' // allows keeping the path prefix clean (optional, or 'always')
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
