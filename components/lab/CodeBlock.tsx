'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

// Language display names
const LANG_LABELS: Record<string, string> = {
  python: 'Python',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  tsx: 'TSX',
  jsx: 'JSX',
  bash: 'Shell',
  sh: 'Shell',
  sql: 'SQL',
  json: 'JSON',
  yaml: 'YAML',
  css: 'CSS',
  html: 'HTML',
  rust: 'Rust',
  go: 'Go',
  cpp: 'C++',
  c: 'C',
};

// Accent colors per language
const LANG_COLORS: Record<string, string> = {
  python:     'text-yellow-400 border-yellow-800/60 bg-yellow-950/30',
  typescript: 'text-blue-400 border-blue-800/60 bg-blue-950/30',
  javascript: 'text-yellow-300 border-yellow-700/60 bg-yellow-950/20',
  tsx:        'text-cyan-400 border-cyan-800/60 bg-cyan-950/30',
  jsx:        'text-cyan-300 border-cyan-700/60 bg-cyan-950/20',
  bash:       'text-green-400 border-green-800/60 bg-green-950/30',
  sh:         'text-green-400 border-green-800/60 bg-green-950/30',
  sql:        'text-orange-400 border-orange-800/60 bg-orange-950/30',
  json:       'text-slate-300 border-slate-700/60 bg-slate-900/30',
  rust:       'text-orange-500 border-orange-800/60 bg-orange-950/30',
  go:         'text-cyan-300 border-cyan-700/60 bg-cyan-950/20',
};

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
}

export default function CodeBlock({ className, children, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-python")
  const langMatch = /language-(\w+)/.exec(className ?? '');
  const lang = langMatch?.[1] ?? '';
  const label = (LANG_LABELS[lang] ?? lang.toUpperCase()) || 'CODE';
  const colorClass = LANG_COLORS[lang] ?? 'text-slate-400 border-slate-700/60 bg-slate-900/30';

  // Inline code (backtick spans inside prose)
  if (inline) {
    return (
      <code className="font-mono text-sm text-cyan-300 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5">
        {children}
      </code>
    );
  }

  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="group relative my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>

        {/* Language badge */}
        {label && (
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${colorClass}`}>
            {label}
          </span>
        )}

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-800"
          title="Copy code"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Copied!</span></>
          ) : (
            <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre className="overflow-x-auto p-5 text-sm leading-relaxed font-mono text-slate-300">
        <code className={className}>{code}</code>
      </pre>
    </div>
  );
}
