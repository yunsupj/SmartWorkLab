'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, Calendar } from 'lucide-react';

interface LegalMarkdownProps {
  content: string;
  /** Page locale — drives the "Last updated" / TOC labels. Defaults to 'en'. */
  locale?: string;
}

export default function LegalMarkdown({ content, locale = 'en' }: LegalMarkdownProps) {
  const ko = locale === 'ko';
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Extract the last-updated date from the document itself.
  // EN docs use "Last Updated: ...", KO docs use "최종 수정일: ...".
  const lastUpdatedMatch =
    content.match(/Last Updated:\s*(.*?)(\n|$)/i) ?? content.match(/최종 수정일:\s*(.*?)(\n|$)/);
  const lastUpdated = lastUpdatedMatch ? lastUpdatedMatch[1].trim().replace(/\*+/g, '') : null;

  useEffect(() => {
    // Parse headings for TOC
    const lines = content.split('\n');
    const extractedHeadings: { id: string; text: string; level: number }[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        // Simple ID generation: mostly works for standard English/Korean headers
        const id = text.toLowerCase().replace(/[^a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+/g, '-').replace(/(^-|-$)/g, '');

        if (text.toLowerCase() !== 'last updated' && !text.includes('Terms of Service') && !text.includes('Privacy Policy') && !text.includes('이용약관') && !text.includes('개인정보 처리방침')) {
             if (level > 1) {
                 extractedHeadings.push({ id, text, level });
             }
        }
      }
    });
    setHeadings(extractedHeadings);

    // Scroll Spy
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const heading of extractedHeadings) {
        const element = document.getElementById(heading.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(heading.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [content]);

  // Smooth Scroll
  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveId(id);
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row gap-12 items-start">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-8 p-6 bg-[#DCE8DF]/50 border border-[#4C6B59]/30 rounded-2xl inline-flex items-center gap-3">
             <div className="bg-[#4C6B59]/15 p-2 rounded-lg text-[#4C6B59]">
                <Calendar className="w-5 h-5" />
             </div>
             <div>
                <p className="text-xs text-[#4C6B59] uppercase tracking-widest font-bold">
                  {ko ? '최종 수정일' : 'Last updated'}
                </p>
                <p className="text-[#1C2321] font-medium">{lastUpdated || 'January 30, 2026'}</p>
             </div>
        </div>

        <article className="prose max-w-none
          text-[#4A5550] leading-loose
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#1C2321]
          prose-h1:text-4xl prose-h1:mb-10
          prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-[#E4E7E2]
          prose-h3:text-xl prose-h3:text-[#4C6B59] prose-h3:mt-10 prose-h3:mb-4
          prose-p:text-[#4A5550] prose-p:leading-loose prose-p:mb-6
          prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-li:text-[#4A5550] prose-li:marker:text-[#8A938E] prose-li:pl-2
          prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2
          prose-strong:text-[#1C2321] prose-strong:font-semibold
          prose-a:text-[#4C6B59] prose-a:no-underline prose-a:border-b prose-a:border-[#4C6B59]/30 hover:prose-a:border-[#4C6B59] transition-all
          prose-hr:border-[#E4E7E2] prose-hr:my-16
        ">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 {...props} />,
              h2: ({ node, children, ...props }) => {
                const text = String(children);
                const id = text.toLowerCase().replace(/[^a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+/g, '-').replace(/(^-|-$)/g, '');
                return <h2 id={id} {...props}>{children}</h2>;
              },
              h3: ({ node, children, ...props }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+/g, '-').replace(/(^-|-$)/g, '');
                  return <h3 id={id} {...props}>{children}</h3>;
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>

      {/* Sticky Sidebar (TOC) */}
      <aside className="hidden lg:block w-72 sticky top-32 shrink-0">
        <div className="bg-[#FFFFFF] border border-[#E4E7E2] rounded-2xl p-6 shadow-sm">
          <h4 className="text-xs font-bold text-[#8A938E] uppercase tracking-widest mb-4">
            {ko ? '이 페이지에서' : 'On this page'}
          </h4>
          <nav className="space-y-1">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => scrollToSection(e, heading.id)}
                className={`block text-sm py-2 px-3 rounded-lg transition-all line-clamp-1 border-l-2 ${
                  activeId === heading.id
                    ? 'bg-[#DCE8DF]/60 text-[#4C6B59] border-[#4C6B59] font-medium'
                    : 'text-[#66716C] hover:text-[#1C2321] hover:bg-[#F7F7F4] border-transparent'
                }`}
                style={{ marginLeft: (heading.level - 2) * 12 }}
              >
                {heading.text}
              </a>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-[#E4E7E2]">
             <a href={`/${locale}`} className="flex items-center gap-2 text-xs text-[#66716C] hover:text-[#4C6B59] transition-colors group">
                <div className="bg-[#F7F7F4] border border-[#E4E7E2] p-1.5 rounded group-hover:border-[#4C6B59] transition-colors">
                    <ChevronRight className="w-3 h-3 rotate-180" />
                </div>
                {ko ? '홈으로' : 'Back to Home'}
             </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
