"use client";

import { usePathname, useRouter } from "next/navigation";
import { getPathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();

  const locales = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const currentLocale = pathname.startsWith('/en') ? 'en' : 'es';

  const handleChange = (locale: string) => {
    const newPath = getPathname({ locale, href: pathname });
    router.push(newPath);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 hover:bg-gray-800/50 transition-colors"
        aria-label="Cambiar idioma"
      >
        <Globe className="h-4 w-4 text-gray-400" aria-hidden="true" />
        <span className="text-sm font-medium text-white">
          {locales.find(l => l.code === currentLocale)?.flag} {currentLocale.toUpperCase()}
        </span>
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {locales.map((locale) => (
          <button
            key={locale.code}
            onClick={() => handleChange(locale.code)}
            className={`w-full px-3 py-2 text-left text-sm transition-colors ${currentLocale === locale.code ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'}`}
          >
            <span className="flex items-center gap-2">
              {locale.flag}
              <span>{locale.name}</span>
              {currentLocale === locale.code && <span className="ml-auto text-purple-400">✓</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}