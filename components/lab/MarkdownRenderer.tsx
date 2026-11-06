'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import codeTheme from '@/lib/codeTheme';
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
import HybridRagSim from './HybridRagSim';
import AgenticLoopSim from './AgenticLoopSim';
import VlmScannerSim from './VlmScannerSim';
import RedisBufferSim from './RedisBufferSim';

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
      prose prose-slate max-w-[68ch] mx-auto
      prose-p:text-lg prose-p:leading-8
      prose-li:text-lg prose-li:leading-8
      prose-headings:mt-12 prose-headings:mb-6
      prose-headings:font-[family-name:var(--font-geist-sans)] prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#1C2321]
      prose-strong:text-[#4C6B59]
      prose-code:text-[#C2557A] prose-code:bg-[#FFFFFF] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-img:rounded-xl prose-img:border prose-img:border-[#E4E7E2]
      lg:prose-lg
      prose-a:text-[#4C6B59] prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-l-[#4C6B59] prose-blockquote:bg-white/70 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:text-[#66716C] prose-blockquote:not-italic
      prose-li:marker:text-[#4C6B59]
      prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-0
      prose-table:block prose-table:overflow-x-auto prose-table:whitespace-nowrap
      prose-th:text-[#1C2321] prose-td:text-[#66716C]
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
                style={codeTheme as any}
                language={match[1]}
                PreTag="div"
                className="rounded-xl border border-[#334155] my-6 text-sm"
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
              <blockquote className="pl-5 border-l-4 border-[#4C6B59] bg-white/70 rounded-r-xl py-3 pr-4 my-6 text-[#66716C]">
                {children}
              </blockquote>
            );
          },

          // Tables with dark theme
          table({ children }: any) {
            return (
              <div className="overflow-x-auto my-8 rounded-xl border border-[#E4E7E2] px-3">
                <table className="w-full text-sm">{children}</table>
              </div>
            );
          },
          th({ children }: any) {
            return (
              <th className="px-4 py-3 text-left font-semibold text-[#66716C] bg-[#FFFFFF] border-b border-[#D5DAD3]">
                {children}
              </th>
            );
          },
          td({ children }: any) {
            return (
              <td className="px-4 py-3 text-[#66716C] border-b border-[#E4E7E2]">
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
                if (demoid === 'hybrid-rag-sim') return <SimulationSlot><HybridRagSim /></SimulationSlot>;
                if (demoid === 'agentic-loop-sim') return <SimulationSlot><AgenticLoopSim /></SimulationSlot>;
                if (demoid === 'vlm-scanner-sim') return <SimulationSlot><VlmScannerSim /></SimulationSlot>;
                if (demoid === 'redis-buffer-sim') return <SimulationSlot><RedisBufferSim /></SimulationSlot>;

                return <SimulationSlot />;
              },
            } as any)}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
