'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function MermaidEffect({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'var(--font-geist-sans), sans-serif',
    });
    
    if (containerRef.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, chart)
        .then(({ svg }) => {
          if (containerRef.current) containerRef.current.innerHTML = svg;
        })
        .catch(e => {
          console.error('Mermaid render error', e);
          if (containerRef.current) containerRef.current.innerHTML = `<div class="text-rose-400 text-sm">Mermaid Syntax Error</div>`;
        });
    }
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      className="mermaid-wrapper bg-slate-900 p-6 rounded-xl border border-slate-800 my-8 flex justify-center overflow-x-auto" 
    />
  );
}
