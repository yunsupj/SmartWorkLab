'use client';
import { useState } from 'react';

export default function PoseMatrixCompare() {
  const [activeModel, setActiveModel] = useState<'yolo' | 'openpose' | 'mediapipe'>('mediapipe');

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl my-12 font-sans overflow-hidden">
      <div className="flex flex-col md:flex-row gap-8 min-h-[440px]">
        {/* Text and Controls */}
        <div className="flex-1 space-y-6 flex flex-col justify-center">
          <div>
            <h3 className="text-2xl font-black text-white mb-3">CV Model Efficiency</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Processing 3D skeletal data dynamically forces a strict trade-off between server compute and anatomical accuracy.
            </p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => setActiveModel('yolo')}
              className={`w-full text-left p-4 rounded-xl border transition-all ${activeModel === 'yolo' ? 'bg-slate-900 border-slate-500 shadow-[0_0_15px_rgba(100,116,139,0.2)]' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`font-bold uppercase tracking-widest text-xs ${activeModel === 'yolo' ? 'text-slate-300' : 'text-slate-500'}`}>YOLOv8-Pose</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">17-Point</span>
              </div>
              <p className="text-[10px] text-slate-500">Fast, but lacks critical 3D depth and rotational data.</p>
            </button>

            <button 
              onClick={() => setActiveModel('openpose')}
              className={`w-full text-left p-4 rounded-xl border transition-all ${activeModel === 'openpose' ? 'bg-rose-950/20 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`font-bold uppercase tracking-widest text-xs ${activeModel === 'openpose' ? 'text-rose-400' : 'text-slate-500'}`}>CMU OpenPose</span>
                <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-900 px-2 py-0.5 rounded font-mono">Cost: $$$ (Heavy)</span>
              </div>
              <p className="text-[10px] text-slate-500">Highly accurate, but crumbles under high-concurrency API load.</p>
            </button>

            <button 
              onClick={() => setActiveModel('mediapipe')}
              className={`w-full text-left p-4 rounded-xl border transition-all ${activeModel === 'mediapipe' ? 'bg-cyan-950/20 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`font-bold uppercase tracking-widest text-xs ${activeModel === 'mediapipe' ? 'text-cyan-400' : 'text-slate-500'}`}>MediaPipe BlazePose</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-900 px-2 py-0.5 rounded font-mono">Cost: $0.001 (Optimized)</span>
              </div>
              <p className="text-[10px] text-slate-500">33-point dense tracking. Runs flawlessly in isolated CPU containers.</p>
            </button>
          </div>
        </div>

        {/* Visualizer */}
        <div className="w-full md:w-72 lg:w-80 h-80 md:h-auto shrink-0 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative shadow-inner flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-20 pointer-events-none" />
            
            <svg viewBox="0 0 100 200" className="w-48 h-full stroke-linecap-round stroke-linejoin-round relative z-10 drop-shadow-2xl">
              {/* Silhouette Body */}
              <path d="M50 15 C55 15, 60 20, 60 27 C60 34, 55 39, 50 39 C45 39, 40 34, 40 27 C40 20, 45 15, 50 15 Z M25 50 C30 46, 70 46, 75 50 C85 60, 90 90, 85 100 L75 100 L70 80 L70 120 L75 190 L60 190 L55 130 L50 130 L45 130 L40 190 L25 190 L30 120 L30 80 L25 100 L15 100 C10 90, 15 60, 25 50 Z" fill="#0f172a" stroke="#334155" strokeWidth="1" />

              {/* YOLO 17-point (Sparse, Yellow-ish) */}
              {activeModel === 'yolo' && (
                <g stroke="#94a3b8" strokeWidth="1" fill="#cbd5e1">
                   <line x1="50" y1="27" x2="50" y2="50" />
                   <line x1="50" y1="50" x2="33" y2="55" />
                   <line x1="50" y1="50" x2="67" y2="55" />
                   <line x1="33" y1="55" x2="25" y2="80" />
                   <line x1="67" y1="55" x2="75" y2="80" />
                   <line x1="50" y1="50" x2="50" y2="110" />
                   <line x1="50" y1="110" x2="35" y2="150" />
                   <line x1="50" y1="110" x2="65" y2="150" />
                   
                   {/* 17 Nodes */}
                   <circle cx="50" cy="23" r="1.5"/>
                   <circle cx="47" cy="21" r="1.5"/>
                   <circle cx="53" cy="21" r="1.5"/>
                   <circle cx="50" cy="27" r="2"/>
                   
                   <circle cx="33" cy="55" r="2.5"/>
                   <circle cx="67" cy="55" r="2.5"/>
                   <circle cx="25" cy="80" r="2"/>
                   <circle cx="75" cy="80" r="2"/>
                   <circle cx="20" cy="100" r="2"/>
                   <circle cx="80" cy="100" r="2"/>

                   <circle cx="40" cy="110" r="2.5"/>
                   <circle cx="60" cy="110" r="2.5"/>
                   
                   <circle cx="35" cy="150" r="2"/>
                   <circle cx="65" cy="150" r="2"/>
                   <circle cx="30" cy="185" r="2"/>
                   <circle cx="70" cy="185" r="2"/>
                </g>
              )}

              {/* OpenPose (Heavy Red, highly detailed fingers/face abstract) */}
              {activeModel === 'openpose' && (
                <g stroke="#f43f5e" strokeWidth="1" fill="#fda4af" className="opacity-80">
                   <line x1="50" y1="40" x2="50" y2="110" strokeWidth="2" />
                   <line x1="50" y1="50" x2="30" y2="55" strokeWidth="1.5" />
                   <line x1="50" y1="50" x2="70" y2="55" strokeWidth="1.5" />
                   <line x1="30" y1="55" x2="25" y2="85" strokeWidth="1.5" />
                   <line x1="70" y1="55" x2="75" y2="85" strokeWidth="1.5" />
                   <line x1="25" y1="85" x2="20" y2="105" />
                   <line x1="75" y1="85" x2="80" y2="105" />
                   
                   <line x1="50" y1="110" x2="35" y2="115" strokeWidth="1.5" />
                   <line x1="50" y1="110" x2="65" y2="115" strokeWidth="1.5" />
                   <line x1="35" y1="115" x2="30" y2="155" strokeWidth="1.5" />
                   <line x1="65" y1="115" x2="70" y2="155" strokeWidth="1.5" />
                   <line x1="30" y1="155" x2="32" y2="185" strokeWidth="1.5" />
                   <line x1="70" y1="155" x2="68" y2="185" strokeWidth="1.5" />

                   {Array.from({length: 40}).map((_, i) => (
                     <circle key={i} cx={25 + Math.random() * 50} cy={15 + Math.random() * 170} r="1" fill="#fda4af" />
                   ))}
                </g>
              )}

              {/* MediaPipe BlazePose (Cyberpunk Cyan, depth nodes) */}
              {activeModel === 'mediapipe' && (
                <g stroke="#06b6d4" strokeWidth="0.8" fill="#22d3ee" className="drop-shadow-[0_0_5px_#22d3ee]">
                   <line x1="50" y1="20" x2="50" y2="50" />
                   
                   {/* Shoulders to elbows */}
                   <line x1="35" y1="52" x2="25" y2="80" strokeWidth="1.5" />
                   <line x1="65" y1="52" x2="75" y2="80" strokeWidth="1.5" />
                   {/* Elbows to wrists */}
                   <line x1="25" y1="80" x2="20" y2="105" />
                   <line x1="75" y1="80" x2="80" y2="105" />
                   {/* Torso */}
                   <line x1="35" y1="52" x2="40" y2="110" strokeWidth="1.5" />
                   <line x1="65" y1="52" x2="60" y2="110" strokeWidth="1.5" />
                   <line x1="35" y1="52" x2="65" y2="52" strokeWidth="1.5" />
                   <line x1="40" y1="110" x2="60" y2="110" strokeWidth="1.5" />
                   {/* Hips to knees */}
                   <line x1="40" y1="110" x2="35" y2="150" strokeWidth="1.5" />
                   <line x1="60" y1="110" x2="65" y2="150" strokeWidth="1.5" />
                   {/* Knees to ankles */}
                   <line x1="35" y1="150" x2="33" y2="185" />
                   <line x1="65" y1="150" x2="67" y2="185" />
                   
                   {/* Feet/Ankles matrices */}
                   <line x1="33" y1="185" x2="27" y2="190" />
                   <circle cx="33" cy="185" r="2"/> 
                   <circle cx="27" cy="190" r="1.5" fill="#67e8f9"/>
                   <circle cx="38" cy="190" r="1.5" opacity="0.6"/>

                   <line x1="67" y1="185" x2="73" y2="190" />
                   <circle cx="67" cy="185" r="2"/> 
                   <circle cx="73" cy="190" r="1.5" fill="#67e8f9"/>
                   <circle cx="62" cy="190" r="1.5" opacity="0.6"/>

                   {/* Hands matrices */}
                   <circle cx="20" cy="105" r="2"/>
                   <circle cx="16" cy="110" r="1.2"/>
                   <circle cx="22" cy="112" r="1.2"/>
                   
                   <circle cx="80" cy="105" r="2"/>
                   <circle cx="84" cy="110" r="1.2"/>
                   <circle cx="78" cy="112" r="1.2"/>

                   {/* Body Core */}
                   <circle cx="35" cy="52" r="2.5"/>
                   <circle cx="65" cy="52" r="2.5"/>
                   <circle cx="40" cy="110" r="2.5"/>
                   <circle cx="60" cy="110" r="2.5"/>
                   
                   <circle cx="25" cy="80" r="2"/>
                   <circle cx="75" cy="80" r="2"/>
                   <circle cx="35" cy="150" r="2"/>
                   <circle cx="65" cy="150" r="2"/>

                   {/* Face matrix */}
                   <circle cx="50" cy="26" r="1.5" />
                   <circle cx="46" cy="23" r="1" />
                   <circle cx="54" cy="23" r="1" />
                   <circle cx="42" cy="24" r="1.5" opacity="0.5"/>
                   <circle cx="58" cy="24" r="1.5" opacity="0.5"/>
                </g>
              )}
            </svg>
            
            {activeModel === 'mediapipe' && (
              <div className="absolute top-4 left-4 text-[9px] font-mono text-cyan-400 capitalize tracking-widest bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800">
                Depth Tracking = Active
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
