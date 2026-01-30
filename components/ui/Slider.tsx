import React from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ value, min, max, step = 1, onChange, className = '' }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full h-6 flex items-center ${className}`}>
      {/* Track Background */}
      <div className="absolute w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        {/* Fill */}
        <div
          className="h-full bg-cyan-500 rounded-full transition-all duration-150 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Thumb (Input) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
      />

      {/* Visual Thumb (Optional, for better styling than native) */}
      <div
        className="absolute w-5 h-5 bg-white border-2 border-cyan-500 rounded-full shadow-lg pointer-events-none transition-all duration-150 ease-out"
        style={{ left: `calc(${percentage}% - 10px)` }}
      />
    </div>
  );
};
