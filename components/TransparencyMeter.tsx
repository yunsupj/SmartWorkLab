import { useTranslations } from 'next-intl';

export default function TransparencyMeter({ sourceCount = 0 }: { sourceCount?: number }) {
  const t = useTranslations('TransparencyMeter');
  const maxSources = 10;
  const percentage = Math.min((sourceCount / maxSources) * 100, 100);

  // Color scale relative to "transparency"
  const getColor = (percent: number) => {
    if (percent < 30) return 'bg-red-500';
    if (percent < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-sm">
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-sm font-semibold text-slate-300">{t('score')}</h3>
        <span className="text-xs text-slate-500">{t('analyzed', {count: sourceCount})}</span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${getColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {t('desc')}
      </p>
    </div>
  );
}
