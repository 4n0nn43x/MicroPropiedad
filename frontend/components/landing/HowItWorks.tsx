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
    <section className="py-20 bg-dark-card relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">
            <span className="glow-text">{t('title')}</span>
          </h2>
          <p className="text-gray-400 text-lg">Get started in 4 simple steps</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                {/* Connection Line */}
                {step.step < 4 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-[2px] bg-gradient-to-r from-primary-500 to-accent-purple z-0" />
                )}

                {/* Step Card */}
                <div className="relative glass-card-hover p-6 text-center z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple text-white font-bold text-xl mb-4 shadow-glow">
                    {step.step}
                  </div>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dark-bg text-primary-400 mb-4">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
