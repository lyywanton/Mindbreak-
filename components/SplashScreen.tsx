
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [animationClass, setAnimationClass] = useState('opacity-100');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationClass('opacity-0 scale-110 pointer-events-none');
      setTimeout(onFinish, 800);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${animationClass}`}>
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background Glow */}
        <div className="absolute w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] animate-pulse"></div>
        
        {/* Sketchy Clock Face */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Main Circle - Sketchy look using multiple slightly offset paths */}
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.5" 
            strokeDasharray="1 3"
            className="opacity-20"
          />
          <path 
            d="M 50 10 A 40 40 0 1 1 49.9 10" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.5" 
            className="opacity-10"
            style={{ strokeDasharray: '250', strokeDashoffset: '250', animation: 'drawCircle 2s ease-out forwards' }}
          />

          {/* Hour markers - Minimalist dots */}
          {[0, 90, 180, 270].map(deg => (
            <circle 
              key={deg}
              cx="50" cy="10" r="1"
              fill="white"
              className="opacity-40"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
          
          {/* Highlighted 15 min sector (0 to 90 degrees) */}
          <path 
            d="M 50 50 L 50 10 A 40 40 0 0 1 90 50 Z" 
            fill="indigo" 
            className="opacity-0"
            style={{
              animation: 'fadeInSector 1s ease-out forwards 2s'
            }}
          />

          {/* Clock Hand - From 0 (top) to 15 mins (right) */}
          <g style={{ transformOrigin: '50px 50px', animation: 'sweep 2s cubic-bezier(0.65, 0, 0.35, 1) forwards 0.8s' }}>
             {/* The primary hand */}
             <line 
                x1="50" y1="50" x2="50" y2="15" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                className="opacity-80 shadow-glow"
             />
             {/* A second 'sketchy' overlapping line for draft feel */}
             <line 
                x1="51" y1="50" x2="50" y2="18" 
                stroke="white" 
                strokeWidth="0.5" 
                strokeLinecap="round"
                className="opacity-30"
                style={{ transform: 'rotate(1deg)' }}
             />
          </g>
          
          {/* Center Pivot Point */}
          <circle cx="50" cy="50" r="2.5" fill="white" className="shadow-lg" />
        </svg>
      </div>

      <div className="mt-12 text-center space-y-4 px-8">
        <div className="overflow-hidden">
            <h1 className="text-3xl font-black tracking-tighter text-white animate-in slide-in-from-bottom-full duration-1000">
              MindBreak
            </h1>
        </div>
        <div className="h-[1px] w-12 bg-indigo-500/50 mx-auto animate-in zoom-in duration-1000 delay-300"></div>
        <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-700 fill-mode-forwards">
          15分钟 碎片化自我提升
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(90deg); }
        }
        @keyframes fadeInSector {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 0.1; transform: scale(1); }
        }
        .shadow-glow {
            filter: drop-shadow(0 0 5px rgba(255,255,255,0.3));
        }
      `}} />
    </div>
  );
};

export default SplashScreen;
