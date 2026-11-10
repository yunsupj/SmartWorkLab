import { Link } from '@/i18n/routing';
import type { Metadata } from 'next';

// Unknown routes and unknown article slugs render this page. Next.js already
// emits robots noindex for the not-found render; this makes it explicit and
// gives visitors a way back instead of an empty shell.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <p className="font-mono text-sm text-[#4C6B59] mb-3">404</p>
      <h1 className="text-2xl font-bold tracking-tight mb-3">Page not found</h1>
      <p className="text-[#66716C] mb-2">This page may have moved or been deleted.</p>
      <p className="text-[#66716C] mb-8">페이지를 찾을 수 없습니다. 주소가 바뀌었거나 삭제되었을 수 있습니다.</p>
      <Link
        href="/lab"
        className="text-[#4C6B59] font-bold hover:underline underline-offset-4"
      >
        Back to Articles · 기술 글 목록으로 →
      </Link>
    </div>
  );
}
