'use client';

import { useTranslations } from 'next-intl';
import { DollarSign, TrendingUp, Zap } from 'lucide-react';

export default function Features() {
  const t = useTranslations('landing.features');

  const features = [
    {
      icon: DollarSign,
      title: t('accessibility.title'),
      description: t('accessibility.description'),
      color: 'text-accent-green',
      gradient: 'from-accent-green/20 to-transparent'
    },
    {
      icon: TrendingUp,
      title: t('passive.title'),
      description: t('passive.description'),
      color: 'text-primary-400',
      gradient: 'from-primary-400/20 to-transparent'
    },
    {
      icon: Zap,
      title: t('liquid.title'),
      description: t('liquid.description'),
      color: 'text-accent-cyan',
      gradient: 'from-accent-cyan/20 to-transparent'
    }
  ];

  return (
    <section className="py-20 bg-dark-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">
            <span className="glow-text">{t('title')}</span>
          </h2>
          <p className="text-gray-400 text-lg">Why choose tokenized real estate</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card-hover p-8 text-center group"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon size={36} className={feature.color} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
