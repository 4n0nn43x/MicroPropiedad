'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Building2, Twitter, Github } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-dark-card border-t border-dark-border text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">{t('company.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary-400 transition">
                  {t('company.about')}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-primary-400 transition">
                  {t('company.careers')}
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-400 hover:text-primary-400 transition">
                  {t('company.press')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">{t('product.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-primary-400 transition">
                  {t('product.marketplace')}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-primary-400 transition">
                  {t('product.howItWorks')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-primary-400 transition">
                  {t('product.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">{t('legal.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-primary-400 transition">
                  {t('legal.terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition">
                  {t('legal.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-gray-400 hover:text-primary-400 transition">
                  {t('legal.compliance')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">{t('social.title')}</h3>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Building2 size={24} className="text-primary-500" />
            <span className="font-bold font-display">MicroPropiedad</span>
          </div>
          <p className="text-gray-500 text-sm">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
