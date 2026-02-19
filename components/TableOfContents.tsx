'use client';

import { useEffect, useState } from 'react';

export default function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    // Parse headings from markdown content
    const matches = content.match(/^(#{2,3})\s+(.+)$/gm);

    if (matches) {
      const parsedHeadings = matches.map((heading) => {
        const level = heading.match(/^#+/)?.[0].length || 2;
        const text = heading.replace(/^#+\s+/, '');
        // Create a simple slug
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');

        return { id, text, level };
      });
      setHeadings(parsedHeadings);
    }
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-24 self-start max-h-[80vh] overflow-y-auto w-64 p-4 border-l border-slate-800">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
        On This Page
      </h4>
      <ul className="space-y-3 text-sm">
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            className={`transition-colors duration-200 ${
              level === 3 ? 'pl-4' : ''
            }`}
          >
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                setActiveId(id);
              }}
              className={`block hover:text-cyan-400 ${
                activeId === id ? 'text-cyan-400 font-medium' : 'text-slate-400'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
