import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import PromoTicker from '@/components/PromoTicker';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
  title: "SmartWorkLab",
  description: "AI Tools & SaaS Platform",
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
          <PromoTicker />
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <div className="mt-auto">
             <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
