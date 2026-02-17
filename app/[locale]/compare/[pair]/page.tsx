
import { getComparisonData } from '@/lib/comparison';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface Props {
  params: {
    locale: string;
    pair: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const { pair, locale } = params;
  const t = await getTranslations({ locale, namespace: 'Comparison' });
  const data = await getComparisonData(pair, locale);

  if (!data) return { title: 'Comparison Not Found' };

  return {
    title: `${data.toolA.name} vs ${data.toolB.name}: ${t('title_suffix')}`,
    description: data.verdict.reason,
    alternates: {
      canonical: `/en/compare/${pair}`
    }
  };
}



export default async function ComparisonPage({ params }: Props) {
  const { pair, locale } = params;
  const data = await getComparisonData(pair, locale);

  if (!data) {
    notFound();
  }

  // Thin Content Check: If verdict reasoning is too short or generic, redirect to main review
  // This helps avoid "Duplicate without user-selected canonical" errors for low-value comparisons
  if (data.verdict.reason.length < 50 || data.verdict.reason.includes('similar value profiles')) {
     // Assuming toolA is the primary one we want to rank for if comparison is bad
      const { redirect } = await import('next/navigation'); // Dynamic import to avoid top-level issues if any
      redirect(`/${locale}/reviews/${data.toolA.id}`);
  }

  const { toolA, toolB, verdict } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-blue-600">{toolA.name}</span> <span className="text-gray-400">vs</span> <span className="text-purple-600">{toolB.name}</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {verdict.reason}
        </p>
      </div>

      {/* Verdict Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-2xl p-8 mb-12 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">🏆 The Verdict: <span className="text-green-600">{verdict.winner === 'Tie' ? 'It\'s a Tie' : verdict.winner} Wins</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WinnerCard category="ROI" winner={verdict.categoryWinners.roi} toolA={toolA.name} toolB={toolB.name} />
            <WinnerCard category="Privacy" winner={verdict.categoryWinners.privacy} toolA={toolA.name} toolB={toolB.name} />
            <WinnerCard category="Integration" winner={verdict.categoryWinners.integration} toolA={toolA.name} toolB={toolB.name} />
        </div>
      </div>

      {/* Side-by-Side Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-left text-gray-500 font-medium">Feature</th>
              <th className="p-4 text-left font-bold text-blue-900 border-l">{toolA.name}</th>
              <th className="p-4 text-left font-bold text-purple-900 border-l">{toolB.name}</th>
            </tr>
          </thead>
          <tbody>
            <Row label="Smart Score" valA={toolA.review.smart_score.total + "/10"} valB={toolB.review.smart_score.total + "/10"} highlightWinner={true} />
            <Row label="Pricing" valA={toolA.price_model} valB={toolB.price_model} />
            <Row label="Category" valA={toolA.category} valB={toolB.category} />
            <Row label="Pros" valA={toolA.review.pros.slice(0, 3).join(', ')} valB={toolB.review.pros.slice(0, 3).join(', ')} />
            <Row label="Critical Flaws" valA={toolA.review.critical_flaws[0] || 'None'} valB={toolB.review.critical_flaws[0] || 'None'} isWarning={true} />
            <Row label="Website"
                 valA={<Link href={toolA.affiliate_link || toolA.website_url} target="_blank" className="text-blue-600 hover:underline">Visit {toolA.name} ↗</Link>}
                 valB={<Link href={toolB.affiliate_link || toolB.website_url} target="_blank" className="text-purple-600 hover:underline">Visit {toolB.name} ↗</Link>}
            />
          </tbody>
        </table>
      </div>

      {/* Structured Data (FAQ) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `Is ${toolA.name} better than ${toolB.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": verdict.reason
                }
              },
              {
                "@type": "Question",
                "name": `Which tool is cheaper, ${toolA.name} or ${toolB.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `${toolA.name} follows a ${toolA.price_model} model, while ${toolB.name} is ${toolB.price_model}.`
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}

function WinnerCard({ category, winner, toolA, toolB }: { category: string, winner: string, toolA: string, toolB: string }) {
    const isTie = winner === 'Tie';
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="text-gray-500 text-sm uppercase tracking-wider mb-2">{category}</div>
            <div className={`font-bold text-lg ${isTie ? 'text-gray-700' : (winner === toolA ? 'text-blue-600' : 'text-purple-600')}`}>
                {winner}
            </div>
        </div>
    )
}

function Row({ label, valA, valB, highlightWinner = false, isWarning = false }: any) {
    const scoreA = parseFloat(valA);
    const scoreB = parseFloat(valB);
    const winA = highlightWinner && !isNaN(scoreA) && !isNaN(scoreB) && scoreA > scoreB;
    const winB = highlightWinner && !isNaN(scoreA) && !isNaN(scoreB) && scoreB > scoreA;

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="p-4 text-gray-600">{label}</td>
            <td className={`p-4 border-l ${winA ? 'bg-green-50 font-bold text-green-800' : ''} ${isWarning ? 'text-red-600' : ''}`}>
                {valA}
            </td>
            <td className={`p-4 border-l ${winB ? 'bg-green-50 font-bold text-green-800' : ''} ${isWarning ? 'text-red-600' : ''}`}>
                {valB}
            </td>
        </tr>
    );
}
