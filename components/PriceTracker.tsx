'use client';

import { useState, useEffect } from 'react';

// Mock price data
const INITIAL_PRICES = [
  { name: 'GPT-4 API', price: 0.03, unit: '/1k tokens', trend: 'stable' },
  { name: 'Claude 3 Opus', price: 0.015, unit: '/1k tokens', trend: 'down' },
  { name: 'Midjourney', price: 10, unit: '/month', trend: 'up' },
];

export default function PriceTracker() {
  const [prices, setPrices] = useState(INITIAL_PRICES);

  const [mounted, setMounted] = useState(false);

  // Simulate live updates
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPrices(current => current.map(item => ({
        ...item,
        price: item.price * (1 + (Math.random() * 0.02 - 0.01)) // +/- 1% fluctuation
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {INITIAL_PRICES.map((item) => (
                <div key={item.name} className="bg-slate-900 border border-slate-800 p-4 rounded-lg h-24 animate-pulse">
                </div>
            ))}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {prices.map((item) => (
        <div key={item.name} className="bg-slate-900 border border-slate-800 p-4 rounded-lg relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-2 h-2 m-2 rounded-full animate-pulse bg-green-500" />

          <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-1">{item.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-mono">
              ${item.price.toFixed(4)}
            </span>
            <span className="text-slate-500 text-xs">{item.unit}</span>
          </div>

          <div className={`text-xs mt-2 flex items-center gap-1 ${
            item.trend === 'down' ? 'text-green-400' :
            item.trend === 'up' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {item.trend === 'down' ? '↓' : item.trend === 'up' ? '↑' : '→'}
            <span className="capitalize">{item.trend}</span> trend
          </div>
        </div>
      ))}
    </div>
  );
}
