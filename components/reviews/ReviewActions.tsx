'use client';

import { useState } from 'react';
import { Edit2, X } from 'lucide-react';
import ReviewForm from './ReviewForm';

interface ReviewActionsProps {
  toolName: string;
}

export default function ReviewActions({ toolName }: ReviewActionsProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="mt-12 bg-slate-900 border border-slate-800 rounded-xl p-6 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Edit Expert Review</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <ReviewForm toolName={toolName} />
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={() => setIsEditing(true)}
        className="bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-full shadow-lg shadow-cyan-900/20 transition-all hover:scale-110 flex items-center gap-2 group"
      >
        <Edit2 className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
          Edit Review
        </span>
      </button>
    </div>
  );
}
