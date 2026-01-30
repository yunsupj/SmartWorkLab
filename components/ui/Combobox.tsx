'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({ options, value, onChange, placeholder = "Select...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = query === ''
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );

  const selectedLabel = options.find(o => o.value === value)?.label || query;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className="relative flex items-center w-full bg-slate-950 border border-slate-700 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-cyan-500 transition-all cursor-text"
        onClick={() => {
            setIsOpen(true);
        }}
      >
        <Search className="w-4 h-4 text-slate-500 ml-3" />
        <input
          type="text"
          className="w-full bg-transparent border-none text-white text-sm p-3 focus:outline-none placeholder:text-slate-500"
          placeholder={placeholder}
          value={isOpen ? query : (options.find(o => o.value === value)?.label || value)}
          onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              // Allow custom values if not found?
              // For now, let's just let them type.
              onChange(e.target.value); // Sync query as value momentarily for free text
          }}
          onFocus={() => setIsOpen(true)}
        />
        <ChevronDown
            className={`w-4 h-4 text-slate-500 mr-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
            }}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto"
          >
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-slate-500 text-center">No results found.</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center justify-between p-3 text-sm cursor-pointer transition-colors ${
                    option.value === value ? 'bg-cyan-900/30 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                  onClick={() => {
                    onChange(option.value); // Select logic needs to distinguish between ID and Name?
                    // Usually we pass value, but display label.
                    // Here we will simplify: onChange passes the VALUE (which could be name or ID).
                    setQuery(''); // Reset query
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                  {option.value === value && <Check className="w-4 h-4" />}
                </div>
              ))
            )}
            {/* Allow creating new option only if needed, for calculator "Other" is fine */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
