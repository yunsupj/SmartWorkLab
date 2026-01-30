import { useTranslations } from 'next-intl';

export const runtime = 'edge';

export default function LoginPage() {
  const t = useTranslations('Login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <h1 className="text-2xl font-bold text-white mb-4">
          🔐 {t('title')}
        </h1>
        <p className="text-slate-400 mb-8">
          {t('description')}
        </p>

        <div className="space-y-4">
          <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
            <span className="text-xl">G</span> {t('google')}
          </button>
          <button className="w-full bg-[#5865F2] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
             {t('discord')}
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          {t('terms')}
        </p>
      </div>
    </div>
  );
}
