'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, Calendar } from 'lucide-react';

interface LegalMarkdownProps {
  content: string;
}

export default function LegalMarkdown({ content }: LegalMarkdownProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Extract Last Updated Date
  const lastUpdatedMatch = content.match(/Last Updated: (.*?)(\n|$)/i);
  const lastUpdated = lastUpdatedMatch ? lastUpdatedMatch[1] : null;

  // Remove Title and Last Updated from main content for rendering if desired,
  // or just render as is. We'll render as is but custom style the h1.

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
             // Skip main title in TOC if it's redundant, but actually typically we want 1. 2. 3.
             // Let's include everything level 2 and 3 usually
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
        <div className="mb-8 p-6 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl backdrop-blur-sm inline-flex items-center gap-3">
             <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">
                <Calendar className="w-5 h-5" />
             </div>
             <div>
                <p className="text-xs text-cyan-400 uppercase tracking-widest font-bold">Effective Date</p>
                <p className="text-slate-300 font-medium">{lastUpdated || 'January 30, 2026'}</p>
             </div>
        </div>

        <article className="prose prose-invert prose-lg max-w-none
          text-slate-300 leading-loose
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
          prose-h1:text-4xl prose-h1:mb-10 prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-slate-400
          prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-800
          prose-h3:text-xl prose-h3:text-cyan-400 prose-h3:mt-10 prose-h3:mb-4
          prose-p:text-slate-300 prose-p:leading-loose prose-p:mb-6
          prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-li:text-slate-300 prose-li:marker:text-slate-500 prose-li:pl-2
          prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2
          prose-strong:text-white prose-strong:font-semibold
          prose-a:text-cyan-400 prose-a:no-underline prose-a:border-b prose-a:border-cyan-500/30 hover:prose-a:border-cyan-400 hover:prose-a:text-cyan-300 transition-all
          prose-hr:border-slate-800 prose-hr:my-16
        ">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 {...props} />, // Main title usually handled by page, but legal docs have it inline
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
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">On this page</h4>
          <nav className="space-y-1">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => scrollToSection(e, heading.id)}
                className={`block text-sm py-2 px-3 rounded-lg transition-all line-clamp-1 border-l-2 ${
                  activeId === heading.id
                    ? 'bg-cyan-950/30 text-cyan-400 border-cyan-500 font-medium'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border-transparent'
                }`}
                style={{ marginLeft: (heading.level - 2) * 12 }}
              >
                {heading.text}
              </a>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-slate-800">
             <a href="/" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors group">
                <div className="bg-slate-800 p-1.5 rounded group-hover:bg-slate-700 transition-colors">
                    <ChevronRight className="w-3 h-3 rotate-180" />
                </div>
                Back to Home
             </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
