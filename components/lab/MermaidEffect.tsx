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
      htmlLabels: true,
      fontFamily: 'var(--font-geist-sans)',
      themeVariables: {
        fontSize: '20px', // 글씨 크기 강제 축소
        primaryColor: '#082f49',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#0ea5e9',
        lineColor: '#334155',
      },
      flowchart: {
        nodeSpacing: 60,
        rankSpacing: 60,
        padding: 30, // 노드 내부 여백 확대
        useMaxWidth: true,
      },
    });

    if (containerRef.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, chart)
        .then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
            // SVG 내부의 모든 텍스트 크기를 한 번 더 강제 조정
            const texts = containerRef.current.querySelectorAll('text, .nodeLabel');
            texts.forEach((el: any) => {
              el.style.fontSize = '20px';
            });
          }
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
