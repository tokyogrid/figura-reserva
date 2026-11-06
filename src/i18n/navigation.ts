import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { routing } from './routing';

const navigation = createSharedPathnamesNavigation(routing);

export const { Link, redirect, usePathname, useRouter } = navigation;

type PathnameValue = string | Record<string, string>;

export function getPathname({ locale, href }: { locale: string; href: string }): string {
  const pathnames = routing.pathnames;
  if (!pathnames) return href;
  
  const hrefPath = href.startsWith('/') ? href : `/${href}`;
  const path = pathnames[hrefPath as keyof typeof pathnames] as PathnameValue | undefined;
  if (!path) return href;
  
  const localizedPath = typeof path === 'string' ? path : path[locale];
  return localizedPath || href;
}