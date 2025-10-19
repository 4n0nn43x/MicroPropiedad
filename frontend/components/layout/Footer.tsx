'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Building2, Twitter, Github } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('company.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  {t('company.about')}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition">
                  {t('company.careers')}
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-400 hover:text-white transition">
                  {t('company.press')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('product.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-white transition">
                  {t('product.marketplace')}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white transition">
                  {t('product.howItWorks')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition">
                  {t('product.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('legal.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  {t('legal.terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  {t('legal.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-gray-400 hover:text-white transition">
                  {t('legal.compliance')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('social.title')}</h3>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Building2 size={24} className="text-primary-500" />
            <span className="font-bold">MicroPropiedad</span>
          </div>
          <p className="text-gray-400 text-sm">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
