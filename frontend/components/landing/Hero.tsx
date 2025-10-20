'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Shield, Coins } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('landing.hero');
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Powered by Bitcoin & Stacks</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl lg:text-7xl font-display font-bold leading-tight">
              <span className="glow-text">{t('title')}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-400 max-w-xl">
              {t('subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/login`}
                className="btn btn-primary text-center"
              >
                {t('cta')}
              </Link>
              <Link
                href={`/${locale}/marketplace`}
                className="btn btn-outline text-center"
              >
                Explore Properties
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary-400">
                  <TrendingUp size={20} />
                  <span className="text-2xl font-bold">8.5%</span>
                </div>
                <p className="text-xs text-gray-500">Avg. ROI</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-accent-green">
                  <Coins size={20} />
                  <span className="text-2xl font-bold">$10</span>
                </div>
                <p className="text-xs text-gray-500">Min. Investment</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-accent-purple">
                  <Shield size={20} />
                  <span className="text-2xl font-bold">100%</span>
                </div>
                <p className="text-xs text-gray-500">Secure</p>
              </div>
            </div>
          </div>

          {/* Right Column - Image Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="glass-card-hover p-4 h-48 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"
                  alt="Modern building"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="glass-card-hover p-4 h-64 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
                  alt="Luxury property"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="glass-card-hover p-4 h-64 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
                  alt="Real estate"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="glass-card-hover p-4 h-48 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716"
                  alt="Property investment"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
