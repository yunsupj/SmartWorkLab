import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Index');
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="mt-4 text-xl">{t('description')}</p>
      </div>
    </main>
  );
}
