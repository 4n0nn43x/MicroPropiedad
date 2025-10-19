'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const t = useTranslations('landing.hero');
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  return (
    <section className="relative h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/buildings/hero-building.jpg"
          alt="Modern building"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-700/80 to-primary-500/60" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
        <h1 className="text-6xl font-bold mb-6 animate-fade-in">
          {t('title')}
        </h1>
        <p className="text-2xl mb-8 max-w-3xl mx-auto opacity-95">
          {t('subtitle')}
        </p>
        <Link
          href={`/${locale}/login`}
          className="inline-block bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
