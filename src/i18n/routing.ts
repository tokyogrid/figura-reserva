import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/catalogo': {
      es: '/catalogo',
      en: '/catalog',
    },
    '/solicitar-figura': {
      es: '/solicitar-figura',
      en: '/request',
    },
    '/como-funciona': {
      es: '/como-funciona',
      en: '/how-it-works',
    },
    '/contacto': {
      es: '/contacto',
      en: '/contact',
    },
    '/catalogo/[slug]': {
      es: '/catalogo/[slug]',
      en: '/catalog/[slug]',
    },
  },
});