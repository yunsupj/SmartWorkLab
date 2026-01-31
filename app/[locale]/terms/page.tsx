import LegalMarkdown from '@/components/LegalMarkdown';
import { promises as fs } from 'fs';
import path from 'path';

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Determine file path based on locale (default to EN)
  const lang = locale === 'ko' ? 'KO' : 'EN';
  const filePath = path.join(process.cwd(), 'docs', 'legal', `TERMS_OF_SERVICE_${lang}.md`);

  let content = '';
  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    content = '# Terms of Service Not Found\n\nPlease contact support.';
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-24 px-6">
      <div className="max-w-3xl mx-auto bg-slate-900/50 p-8 md:p-12 rounded-2xl border border-slate-800">
        <LegalMarkdown content={content} />
      </div>
    </div>
  );
}
