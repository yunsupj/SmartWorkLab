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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ogLocale = locale === 'ko' ? 'ko_KR' : 'en_US';
  return {
    metadataBase: new URL('https://www.smartworklab.store'),
    title: {
      default: locale === 'ko'
        ? "SmartWorkLab | 모찌 새싹 — 오픈소스 피지컬 AI 로봇"
        : "SmartWorkLab | Mochi Sprout — Open-Source Physical AI Robot",
      template: "%s | SmartWorkLab"
    },
    description: locale === 'ko'
      ? '모찌 새싹은 오픈소스 피지컬 AI 프로젝트입니다. 작은 반려 로봇을 시뮬레이션하고, 배우고, 평가하고, 공개적으로 만듭니다. 공부 → 실험 → 구축 → 평가 → 기록.'
      : "Mochi Sprout is an open-source Physical AI project: simulate, learn, evaluate, and build a small companion robot in public. Study → Experiment → Build → Evaluate → Document.",
    keywords: ['Physical AI', 'MuJoCo', 'robotics simulation', 'Mochi Sprout', 'reinforcement learning', 'ML engineering'],
    openGraph: {
      type: 'website',
      locale: ogLocale,
      siteName: 'SmartWorkLab',
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F7F7F4",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F7F7F4] text-[#1C2321] flex flex-col min-h-screen`}
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
