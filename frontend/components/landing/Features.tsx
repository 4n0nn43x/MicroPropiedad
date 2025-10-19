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
      color: 'text-green-500'
    },
    {
      icon: TrendingUp,
      title: t('passive.title'),
      description: t('passive.description'),
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: t('liquid.title'),
      description: t('liquid.description'),
      color: 'text-yellow-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          {t('title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card p-8 text-center hover:scale-105 transition-transform"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6 ${feature.color}`}>
                  <Icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
