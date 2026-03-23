'use client';

import { useState } from 'react';
import { Play, ChevronDown, FlaskConical } from 'lucide-react';

interface SimulationSlotProps {
  /** Unique demo identifier — used for analytics and future dynamic import */
  demoId?: string;
  /** Optional title shown in the header */
  title?: string;
  /** Optional description shown below the title */
  description?: string;
  /** SVG/React content to render as the simulation */
  children?: React.ReactNode;
  /** Height of the simulation canvas */
  height?: number;
}

/**
 * SimulationSlot — a collapsible container for interactive SVG demos.
 * Place inside MarkdownRenderer via a custom MDX component, or directly
 * in a page for standalone demos.
 *
 * Usage in MDX body (future):
 *   <SimulationSlot demoId="vton-flow" title="VTON Forward Pass">
 *     <VtonDiagram />
 *   </SimulationSlot>
 */
export default function SimulationSlot({
  demoId,
  title = 'Interactive Simulation',
  description,
  children,
  height = 400,
}: SimulationSlotProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="my-8 rounded-2xl border border-purple-800/40 bg-gradient-to-br from-purple-950/30 to-slate-950 overflow-hidden"
      data-demo-id={demoId}
    >
      {/* Trigger Bar */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-purple-950/20 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/60 flex items-center justify-center flex-shrink-0">
            {isOpen ? (
              <FlaskConical className="w-4 h-4 text-purple-400" />
            ) : (
              <Play className="w-4 h-4 text-purple-400" />
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-purple-300 group-hover:text-purple-200 transition-colors">
              {isOpen ? title : `▶ Run: ${title}`}
            </p>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-purple-600 bg-purple-950/60 border border-purple-800/40 rounded-full px-2 py-0.5 uppercase tracking-widest">
            Interactive
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Simulation Canvas */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ maxHeight: isOpen ? height + 80 : 0 }}
      >
        <div
          className="border-t border-purple-800/30 bg-slate-950/80 flex items-center justify-center"
          style={{ minHeight: height }}
        >
          {children ?? (
            // Placeholder when no children provided
            <div className="flex flex-col items-center gap-3 text-slate-600 py-16">
              <FlaskConical className="w-10 h-10" />
              <p className="text-sm font-mono">Simulation module coming soon</p>
              <p className="text-xs">
                demoId: <code className="text-slate-500">{demoId ?? 'unset'}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
