'use client';

import { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendContactEmail } from '@/app/actions/contact';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBrief?: string;
}

export default function ContactModal({ isOpen, onClose, defaultBrief = '' }: ContactModalProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [brief, setBrief] = useState(defaultBrief);
  const [errorMessage, setErrorMessage] = useState('');

  // Hydrate fields accurately on render cycles explicitly resolving parameters
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setBrief(defaultBrief);
      setErrorMessage('');
    }
  }, [isOpen, defaultBrief]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    
    // Abstract the exact standard html properties cleanly pointing towards actions
    const formData = new FormData(e.currentTarget);
    const result = await sendContactEmail(formData);
    
    if (result.success) {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 2000);
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Failed to dispatch transmission.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#FFF8EC]/90 backdrop-blur-sm" 
        onClick={() => status !== 'submitting' && onClose()}
      />
      
      {/* Modal Content container */}
      <div className="relative w-full max-w-md bg-[#FDF3E0] border border-[#E8D9BE] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header Ribbon */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8D9BE] bg-white/70">
          <h3 className="text-xl font-bold text-[#3D2C29] tracking-tight">Project Inquiry</h3>
          <button 
            onClick={onClose}
            disabled={status === 'submitting'}
            className="text-[#7A6A5E] hover:text-[#3D2C29] p-2 -mr-2 rounded-full hover:bg-[#F3E6C8] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Form Body */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-16 h-16 text-[#3E9B6A] mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
              <h4 className="text-2xl font-bold text-[#3D2C29] mb-2">Inquiry Received</h4>
              <p className="text-[#7A6A5E] text-sm">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === 'error' && (
                <div className="flex flex-col items-center justify-center p-4 bg-red-950/40 border border-red-900 rounded-xl mb-4 text-center">
                  <AlertCircle className="w-6 h-6 text-red-400 mb-2" />
                  <p className="text-xs text-red-300 font-mono">{errorMessage}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#5C4A42] mb-1.5">Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  disabled={status === 'submitting'}
                  className="w-full bg-[#FFF8EC] border border-[#E8D9BE] text-[#5C4A42] px-4 py-3 rounded-xl focus:outline-none focus:border-[#5FBF8A]/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm placeholder:text-[#7A6A5E]"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5C4A42] mb-1.5">Work Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  disabled={status === 'submitting'}
                  className="w-full bg-[#FFF8EC] border border-[#E8D9BE] text-[#5C4A42] px-4 py-3 rounded-xl focus:outline-none focus:border-[#5FBF8A]/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm placeholder:text-[#7A6A5E]"
                  placeholder="jane@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5C4A42] mb-1.5">Project Brief</label>
                <textarea 
                  name="brief"
                  required
                  disabled={status === 'submitting'}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={4}
                  className="w-full bg-[#FFF8EC] border border-[#E8D9BE] text-[#5C4A42] px-4 py-3 rounded-xl focus:outline-none focus:border-[#5FBF8A]/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm placeholder:text-[#7A6A5E] resize-none"
                  placeholder="Tell us about the problem you're trying to solve..."
                />
              </div>
              
              <button 
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2 mt-2 px-6 py-3.5 text-sm font-bold text-slate-900 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <span className="w-5 h-5 border-2 border-[#E8D9BE]/30 border-t-slate-900 rounded-full animate-spin" />
                ) : (
                  <>Send Message <Send className="w-4 h-4 ml-1" /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
