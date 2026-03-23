import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import Script from 'next/script';
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
  metadataBase: new URL('https://smartworklab.store'),
  title: {
    default: "SmartWorkLab | Expert Tech Blog & AI Development Agency",
    template: "%s | SmartWorkLab"
  },
  description: "Deep-dive ML implementations, paper reviews, and agentic workflow breakdowns. SmartWorkLab also builds custom AI systems — from RSVP microsites to enterprise RAG pipelines.",
  keywords: ['ML engineering', 'AI agency', 'RAG chatbots', 'VTON', 'agentic workflows', 'machine learning blog'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smartworklab.store',
    siteName: 'SmartWorkLab',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SmartWorkLab — Expert Tech Blog & AI Agency',
      },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
