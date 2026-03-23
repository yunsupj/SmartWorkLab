'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import CodeBlock from './CodeBlock';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

/**
 * MarkdownRenderer — renders Markdown with full pipeline:
 *   remark-math  → parse $inline$ and $$block$$ LaTeX syntax
 *   rehype-katex → render LaTeX via KaTeX
 *   CodeBlock    → custom dark-theme code blocks with copy button
 *
 * Typography is handled by @tailwindcss/typography (prose-invert).
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="
      prose prose-invert prose-slate prose-lg max-w-none

      /* Headings */
      prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
      prose-h1:text-4xl prose-h2:text-3xl prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-3
      prose-h3:text-xl prose-h3:text-slate-200

      /* Body text */
      prose-p:text-slate-300 prose-p:leading-relaxed

      /* Links */
      prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium

      /* Inline code — overridden by CodeBlock for fenced blocks */
      prose-code:text-cyan-300 prose-code:bg-slate-900 prose-code:rounded
      prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono
      prose-code:before:content-none prose-code:after:content-none

      /* Blockquotes */
      prose-blockquote:border-l-cyan-500 prose-blockquote:bg-slate-900/50
      prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:text-slate-400
      prose-blockquote:not-italic

      /* Tables */
      prose-table:border-collapse
      prose-th:bg-slate-900 prose-th:text-slate-300 prose-th:font-semibold
      prose-td:border-slate-800 prose-th:border-slate-700

      /* Lists */
      prose-li:text-slate-300 prose-li:marker:text-cyan-500

      /* HR */
      prose-hr:border-slate-800

      /* Pre / code blocks — remove default prose styling, CodeBlock handles it */
      prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-0
    ">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Fenced code blocks + inline code routed through CodeBlock
          code({ className, children, ...props }) {
            const isInline = !className;
            return (
              <CodeBlock className={className} inline={isInline}>
                {children}
              </CodeBlock>
            );
          },

          // Heading anchors — add id for TOC scroll targeting
          h2({ children, ...props }) {
            const id = String(children)
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3({ children, ...props }) {
            const id = String(children)
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');
            return <h3 id={id} {...props}>{children}</h3>;
          },

          // Callout-style blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="pl-5 border-l-4 border-cyan-500 bg-slate-900/50 rounded-r-xl py-3 pr-4 my-6 text-slate-400">
                {children}
              </blockquote>
            );
          },

          // Tables with dark theme
          table({ children }) {
            return (
              <div className="overflow-x-auto my-8 rounded-xl border border-slate-800">
                <table className="w-full text-sm">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-3 text-left font-semibold text-slate-300 bg-slate-900 border-b border-slate-700">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-3 text-slate-400 border-b border-slate-800/60">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
