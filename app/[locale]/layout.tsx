import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import Script from 'next/script';
import Navigation from '@/components/Navigation';
import ScrollRestorer from '@/components/ScrollRestorer';
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
    default: "SmartWorkLab | Mochi Sprout — Open-Source Physical AI Robot",
    template: "%s | SmartWorkLab"
  },
  description: "Mochi Sprout is an open-source Physical AI project: simulate, learn, evaluate, and build a small companion robot in public. Study → Experiment → Build → Evaluate → Document.",
  keywords: ['Physical AI', 'MuJoCo', 'robotics simulation', 'Mochi Sprout', 'reinforcement learning', 'ML engineering'],
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
  themeColor: "#FFF8EC",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FFF8EC] text-[#3D2C29] flex flex-col min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4002042064918650"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            <ScrollRestorer />
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
          </AuthProvider>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
