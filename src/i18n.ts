import { routing } from './i18n/routing';
import { getRequestConfig } from 'next-intl/server';

export { routing };

export default getRequestConfig(async ({ locale }) => {
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { messages };
});