'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface WindowWithDataLayer extends Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
  doNotTrack: string;
}

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!gaId || typeof window === 'undefined') return;

    const win = window as unknown as WindowWithDataLayer;
    const doNotTrack = win.doNotTrack || navigator.doNotTrack;
    if (doNotTrack === '1') {
      return;
    }

    win.dataLayer = win.dataLayer || [];
    function gtag(...args: unknown[]) {
      win.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', gaId, {
      anonymize_ip: true,
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    return () => {
      const existing = document.querySelector(`script[src*="googletagmanager"]`);
      if (existing) existing.remove();
    };
  }, [gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <Script
        id="gtag-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', { anonymize_ip: true });
          `,
        }}
      />
    </>
  );
}
