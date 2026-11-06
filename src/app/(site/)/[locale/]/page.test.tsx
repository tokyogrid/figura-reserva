import { Metadata } from "next";
import React from "react";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  
  return (
    <div className="min-h-screen bg-gray-900">
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
}