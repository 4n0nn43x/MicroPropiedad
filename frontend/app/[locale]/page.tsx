'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  useEffect(() => {
    router.replace(`/${locale}/marketplace`);
  }, [router, locale]);

  return null;
}
