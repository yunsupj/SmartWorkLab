import LegalMarkdown from '@/components/LegalMarkdown';
import { promises as fs } from 'fs';
import path from 'path';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Determine file path based on locale (default to EN)
  const lang = locale === 'ko' ? 'KO' : 'EN';
  const filePath = path.join(process.cwd(), 'docs', 'legal', `PRIVACY_POLICY_${lang}.md`);

  let content = '';
  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    content = '# Privacy Policy Not Found\n\nPlease contact support.';
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#66716C] py-24 px-6">
      <div className="max-w-3xl mx-auto bg-white/70 p-8 md:p-12 rounded-2xl border border-[#E4E7E2]">
        <LegalMarkdown content={content} locale={locale} />
      </div>
    </div>
  );
}
