import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import Script from 'next/script';
import PromoTicker from '@/components/PromoTicker';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import "../globals.css";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SmartWorkLab | Quantify Your AI ROI",
    template: "%s | SmartWorkLab"
  },
  description: "The premier platform for auditing AI tools, calculating efficiency ROI, and verifying software value with expert engineering reviews.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smartworklab.com',
    siteName: 'SmartWorkLab',
    images: [
      {
        url: '/og-image.jpg', // Placeholder
        width: 1200,
        height: 630,
        alt: 'SmartWorkLab Dashboard',
      },
    ],
  },
    viewport: "width=device-width, initial-scale=1",
    themeColor: "#0f172a",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-white`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4002042064918650"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            <PromoTicker />
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
          </AuthProvider>
          <div className="mt-auto">
             <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
