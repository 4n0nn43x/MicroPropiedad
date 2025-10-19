'use client';

import { useTranslations } from 'next-intl';
import { Wallet, Search, ShoppingCart, Coins } from 'lucide-react';

export default function HowItWorks() {
  const t = useTranslations('landing.howItWorks');

  const steps = [
    {
      icon: Wallet,
      title: t('step1.title'),
      description: t('step1.description'),
      step: 1
    },
    {
      icon: Search,
      title: t('step2.title'),
      description: t('step2.description'),
      step: 2
    },
    {
      icon: ShoppingCart,
      title: t('step3.title'),
      description: t('step3.description'),
      step: 3
    },
    {
      icon: Coins,
      title: t('step4.title'),
      description: t('step4.description'),
      step: 4
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          {t('title')}
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                {/* Connection Line */}
                {step.step < 4 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-primary-300 z-0" />
                )}

                {/* Step Card */}
                <div className="relative bg-white rounded-xl p-6 text-center shadow-md z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white font-bold mb-4">
                    {step.step}
                  </div>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-500 mb-4">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
