'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Send, Sliders } from 'lucide-react';

export default function ReviewForm({ toolName, toolId }: { toolName: string; toolId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [scores, setScores] = useState({ roi: 5, privacy: 5, integration: 5, accuracy: 9 });

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

    // Calculate Total Smart Score (Simple Average)
    const totalScore = parseFloat(((scores.roi + scores.privacy + scores.integration + scores.accuracy) / 4).toFixed(1));

    // Upsert to Expert Reports
    const { error } = await supabase
      .from('expert_reports')
      .upsert({
        product_id: toolId,
        author: 'SmartWorkLab AI',
        rating,
        summary: comment,
        smart_score: {
            roi: scores.roi,
            privacy: scores.privacy,
            integration: scores.integration,
            accuracy: scores.accuracy,
            productivity_score: scores.roi, // Mapping ROI to productivity as requested
            total: totalScore
        },
        status: 'pending',
        locale: 'en',
        updated_at: new Date().toISOString()
      }, { onConflict: 'product_id, locale' });

    if (error) {
       console.error('Error submitting report:', error);
       alert(`Failed to submit review: ${error.message} (Code: ${error.code})`);
    } else {
       setSubmitted(true);
       router.refresh(); // Refresh server components to show new aggregation
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
        <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
                <label className="block text-slate-400 text-sm mb-4">Overall Rating</label>
                <div className="flex gap-1 mb-2">
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
                <p className="text-xs text-slate-500">How would you grade this tool overall?</p>
            </div>

            <div className="space-y-4">
                <div>
                     <div className="flex justify-between text-sm mb-1 text-slate-400">
                        <span>ROI Score</span>
                        <span className="text-cyan-400">{scores.roi}/10</span>
                     </div>
                     <input
                        type="range" min="1" max="10"
                        value={scores.roi}
                        onChange={(e) => setScores({...scores, roi: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                     />
                </div>
                <div>
                     <div className="flex justify-between text-sm mb-1 text-slate-400">
                        <span>Privacy & Security</span>
                        <span className="text-cyan-400">{scores.privacy}/10</span>
                     </div>
                     <input
                        type="range" min="1" max="10"
                        value={scores.privacy}
                        onChange={(e) => setScores({...scores, privacy: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                     />
                </div>
                <div>
                     <div className="flex justify-between text-sm mb-1 text-slate-400">
                        <span>Integration Ease</span>
                        <span className="text-cyan-400">{scores.integration}/10</span>
                     </div>
                     <input
                        type="range" min="1" max="10"
                        value={scores.integration}
                        onChange={(e) => setScores({...scores, integration: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                     />
                </div>
                <div>
                     <div className="flex justify-between text-sm mb-1 text-slate-400">
                        <span>Accuracy Rating</span>
                        <span className="text-cyan-400">{scores.accuracy}/10</span>
                     </div>
                     <input
                        type="range" min="1" max="10"
                        value={scores.accuracy}
                        onChange={(e) => setScores({...scores, accuracy: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                     />
                </div>
            </div>
        </div>

        <div className="mb-6">
            <label className="block text-slate-400 text-sm mb-2">
                Analyst Commentary <span className="text-xs text-slate-600">(Supports Markdown & LaTeX: $E=mc^2$)</span>
            </label>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors h-48 font-mono text-sm"
                placeholder="## Analysis\n\nThis tool is **excellent** because..."
                required
            />
        </div>

        <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isSubmitting ? 'Submitting Report...' : (
                <>
                    <Send className="w-4 h-4" />
                    Submit Expert Report
                </>
            )}
        </button>
      </form>
    </div>
  );
}
