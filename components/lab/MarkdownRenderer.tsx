'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import CodeBlock from './CodeBlock';
import 'katex/dist/katex.min.css';
import SimulationSlot from './SimulationSlot';
import GhostSpeedDemo from './GhostSpeedDemo';
import MermaidEffect from './MermaidEffect';
import StyleDnaAnalyzer from './StyleDnaAnalyzer';
import VTONMasterConsole from './VTONMasterConsole';
import PoseMatrixCompare from './PoseMatrixCompare';
import AvatarAlignerSim from './AvatarAlignerSim';
import MiroFishPipelineSim from './MiroFishPipelineSim';

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
      prose prose-invert prose-slate max-w-[85ch] mx-auto
      prose-p:text-lg prose-p:leading-8
      prose-li:text-lg prose-li:leading-8
      prose-headings:mt-12 prose-headings:mb-6
      prose-headings:font-[family-name:var(--font-geist-sans)] prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-100
      prose-strong:text-cyan-400
      prose-code:text-pink-400 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-img:rounded-xl prose-img:border prose-img:border-slate-800
      lg:prose-lg
      prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-l-cyan-500 prose-blockquote:bg-slate-900/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:text-slate-400 prose-blockquote:not-italic
      prose-li:marker:text-cyan-500
      prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-0
    ">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={({
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');

            if (match && match[1] === 'mermaid') {
              return <MermaidEffect chart={String(children)} />;
            }

            return !className ? (
              <code className={className} {...props}>{children}</code>
            ) : match ? (
              <SyntaxHighlighter
                style={atomDark as any}
                language={match[1]}
                PreTag="div"
                className="rounded-xl border border-slate-800 !bg-slate-900/50 my-6 text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <CodeBlock className={className} inline={!className}>
                {children}
              </CodeBlock>
            );
          },

          // Heading anchors — add id for TOC scroll targeting
          h2({ children, ...props }: any) {
            const id = String(children)
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3({ children, ...props }: any) {
            const id = String(children)
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');
            return <h3 id={id} {...props}>{children}</h3>;
          },

          // Callout-style blockquotes
          blockquote({ children }: any) {
            let isTip = false;

            // Helper to recursively check and replace '[!TIP]'
            const extractTip = (node: any): any => {
              if (typeof node === 'string') {
                if (node.includes('[!TIP]')) {
                  isTip = true;
                  return node.replace('[!TIP]', '💡 TIP');
                }
                return node;
              }
              if (React.isValidElement(node)) {
                return React.cloneElement(
                  node as React.ReactElement,
                  {},
                  React.Children.map((node.props as any).children, extractTip)
                );
              }
              if (Array.isArray(node)) {
                return node.map(extractTip);
              }
              return node;
            };

            const processedChildren = extractTip(children);

            if (isTip) {
              return (
                <div className="pl-5 border-l-4 border-amber-500 bg-amber-950/30 rounded-r-xl py-3 pr-4 my-6 text-amber-200/90 font-medium">
                  {processedChildren}
                </div>
              );
            }

            return (
              <blockquote className="pl-5 border-l-4 border-cyan-500 bg-slate-900/50 rounded-r-xl py-3 pr-4 my-6 text-slate-400">
                {children}
              </blockquote>
            );
          },

          // Tables with dark theme
          table({ children }: any) {
            return (
              <div className="overflow-x-auto my-8 rounded-xl border border-slate-800 px-3">
                <table className="w-full text-sm">{children}</table>
              </div>
            );
          },
          th({ children }: any) {
            return (
              <th className="px-4 py-3 text-left font-semibold text-slate-300 bg-slate-900 border-b border-slate-700">
                {children}
              </th>
            );
          },
          td({ children }: any) {
            return (
              <td className="px-4 py-3 text-slate-400 border-b border-slate-800/60">
                {children}
              </td>
            );
          },
          'simulation-slot': (props: any) => {
            const demoid = props.id || props['demo-id'] || props.demoid;
            const title = props.title;
            if (demoid === 'ghost-speed') {
              return (
                <SimulationSlot>
                  <GhostSpeedDemo />
                    </SimulationSlot>
                  );
                }
                if (demoid === 'style-dna') return <StyleDnaAnalyzer />;
                if (demoid === 'vton-console') return <VTONMasterConsole />;
                if (demoid === 'pose-matrix-compare') return <PoseMatrixCompare />;
                if (demoid === 'avatar-aligner-sim') return <AvatarAlignerSim />;
                if (demoid === 'mirofish-pipeline-sim') return <MiroFishPipelineSim />;

                return <SimulationSlot />;
              },
            } as any)}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
