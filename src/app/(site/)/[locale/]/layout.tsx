import { getMessages, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from "@/i18n/routing";

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const localeCode = await getLocale();

  return (
    <html lang={localeCode}>
      <head>
        <link rel="alternate" hrefLang="es" href="https://tokyogridstore.com/" />
        <link rel="alternate" hrefLang="en" href="https://tokyogridstore.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://tokyogridstore.com/" />
      </head>
      <body>{children}</body>
    </html>
  );
}