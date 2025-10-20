'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const t = useTranslations('landing.faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t('q1.question'),
      answer: t('q1.answer')
    },
    {
      question: t('q2.question'),
      answer: t('q2.answer')
    },
    {
      question: t('q3.question'),
      answer: t('q3.answer')
    },
    {
      question: t('q4.question'),
      answer: t('q4.answer')
    }
  ];

  return (
    <section className="py-20 bg-dark-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">
            <span className="glow-text">{t('title')}</span>
          </h2>
          <p className="text-gray-400 text-lg">Everything you need to know</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card border border-dark-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-dark-hover transition"
              >
                <span className="font-semibold text-lg pr-4 text-white">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="flex-shrink-0 text-primary-400" size={24} />
                ) : (
                  <ChevronDown className="flex-shrink-0 text-gray-500" size={24} />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
