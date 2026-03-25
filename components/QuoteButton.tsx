'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ContactModal from '@/components/ContactModal';

interface QuoteButtonProps {
  serviceName: string;
  label: string;
}

export default function QuoteButton({ serviceName, label }: QuoteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 hover:bg-slate-800"
        style={{ borderColor: 'rgb(51,65,85)', color: 'rgb(148,163,184)' }}
      >
        {label} <ArrowRight className="w-4 h-4" />
      </button>

      <ContactModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        defaultBrief={`I am interested in exploring ${serviceName}. `} 
      />
    </>
  );
}
