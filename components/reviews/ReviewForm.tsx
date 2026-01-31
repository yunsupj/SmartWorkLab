'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';
import { Star, Send } from 'lucide-react';

export default function ReviewForm({ toolName, toolId }: { toolName: string; toolId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialize Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert('You must be logged in to submit a review.');
        setIsSubmitting(false);
        return;
    }

    // Upsert to Expert Reports
    const { error } = await supabase
      .from('expert_reports')
      .upsert({
        product_id: toolId,
        author: 'SmartWorkLab AI', // Identifying the author or use user.email
        rating,
        summary: comment,
        status: 'pending', // Or approved if admin
        locale: 'en', // Default locale for now
        updated_at: new Date().toISOString()
      }, { onConflict: 'product_id, locale' });

    if (error) {
       console.error('Error submitting report:', error);
       alert('Failed to submit review.');
    } else {
       setSubmitted(true);
    }

    setIsSubmitting(false);
  };

  if (submitted) {
    return (
        <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl text-center animate-fade-in">
            <h3 className="text-green-400 font-bold text-lg mb-2">Review Submitted!</h3>
            <p className="text-slate-400">Thank you for contributing to the SmartWorkLab intelligence network.</p>
        </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Submit Your Expert Review</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
            <label className="block text-slate-400 text-sm mb-2">Rate {toolName}</label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-colors"
                    >
                        <Star
                            className={`w-8 h-8 ${
                                (hoverRating || rating) >= star
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-700'
                            }`}
                        />
                    </button>
                ))}
            </div>
        </div>

        <div className="mb-6">
            <label className="block text-slate-400 text-sm mb-2">Analyst Commentary</label>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors h-32 resize-none"
                placeholder="Share your experience with detailed pros and cons..."
                required
            />
        </div>

        <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isSubmitting ? 'Submitting...' : (
                <>
                    <Send className="w-4 h-4" />
                    Submit Review
                </>
            )}
        </button>
      </form>
    </div>
  );
}
