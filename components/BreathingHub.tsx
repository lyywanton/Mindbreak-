
import React, { useState, useEffect, useCallback } from 'react';
import { BreathingType } from '../types';

const BreathingHub: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeType, setActiveType] = useState<BreathingType | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [renderPhase, setRenderPhase] = useState(false);

  const configs = {
    box: {
      name: '盒子呼吸 (4-4-4-4)',
      desc: '特种部队常用的心理调节法，用于快速冷静。',
      steps: [
        { label: '吸气', duration: 4, type: 'in' },
        { label: '憋气', duration: 4, type: 'hold' },
        { label: '呼气', duration: 4, type: 'out' },
        { label: '憋气', duration: 4, type: 'hold' }
      ]
    },
    mindful: {
      name: '正念呼吸 (5-0-7-0)',
      desc: '延长呼气时间，深度激活副交感神经。',
      steps: [
        { label: '吸气', duration: 5, type: 'in' },
        { label: '呼气', duration: 7, type: 'out' }
      ]
    },
    grounding: {
      name: '54321 感官着陆',
      desc: '通过调动感官将意识强行拉回现实，缓解焦虑。',
      steps: []
    }
  };

  const startBreathing = (type: BreathingType) => {
    setActiveType(type);
    if (type !== 'grounding') {
      setStepIndex(0);
      setTimeLeft(configs[type].steps[0].duration);
      setIsActive(true);
      // Small delay to ensure the mount transition fires
      setTimeout(() => setRenderPhase(true), 50);
    }
  };

  const nextStep = useCallback(() => {
    if (!activeType || activeType === 'grounding') return;
    const config = configs[activeType];
    const nextIdx = (stepIndex + 1) % config.steps.length;
    setStepIndex(nextIdx);
    setTimeLeft(config.steps[nextIdx].duration);
  }, [activeType, stepIndex]);

  useEffect(() => {
    let timer: number;
    if (isActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      nextStep();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, nextStep]);

  const renderSession = () => {
    if (!activeType || activeType === 'grounding') return null;
    const config = configs[activeType];
    const currentStep = config.steps[stepIndex];
    const phase = currentStep.type;
    
    // Core animation logic
    // If we haven't 'started' the render phase yet, we stay at scale 1 for the 'in' to have a 'from' value.
    const isExpanding = renderPhase && phase === 'in';
    const isShrinking = renderPhase && phase === 'out';
    
    const scale = isExpanding ? 'scale-[1.45]' : isShrinking ? 'scale-[0.8]' : 'scale-[1.1]';
    const opacity = isExpanding ? 'opacity-40' : isShrinking ? 'opacity-15' : 'opacity-25';
    const color = isExpanding ? 'bg-indigo-500' : isShrinking ? 'bg-emerald-500' : 'bg-amber-500';

    return (
      <div className="h-full flex flex-col items-center justify-between py-12 px-6 animate-in fade-in duration-700 overflow-hidden">
        <div className="w-full flex justify-start">
          <button onClick={() => { setIsActive(false); setActiveType(null); setRenderPhase(false); }} className="text-slate-500 font-black hover:text-indigo-600 transition-colors">← 终止练习</button>
        </div>

        <div className="relative w-full flex items-center justify-center py-20">
          {/* Main Breathing Glow */}
          <div 
            className={`absolute rounded-full transition-all ease-linear pointer-events-none ${color} ${scale} ${opacity} blur-[80px]`}
            style={{ 
              width: '240px', 
              height: '240px',
              transitionDuration: `${currentStep.duration}s`
            }}
          />

          {/* Lungs Visualization */}
          <div className="relative flex gap-8 z-10">
            {[0, 1].map(i => (
              <div
                key={i}
                className={`w-24 h-48 rounded-full transition-all ease-linear border-2 border-white/5 glass shadow-2xl ${
                  isExpanding ? 'bg-indigo-400/25' : isShrinking ? 'bg-emerald-400/20' : 'bg-amber-400/10'
                }`}
                style={{ 
                  transitionDuration: `${currentStep.duration}s`,
                  transform: isExpanding ? 'scale(1.3) translateY(-15px)' : isShrinking ? 'scale(0.75) translateY(15px)' : 'scale(1) translateY(0)'
                }}
              />
            ))}
          </div>

          {/* Counter Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 mb-3 drop-shadow-md">
              {currentStep.label}
            </span>
            <div key={timeLeft} className="text-8xl font-black text-quality animate-in zoom-in-75 duration-200">
              {timeLeft}
            </div>
          </div>
        </div>

        <div className="text-center space-y-4 max-w-xs mb-10">
          <h3 className="text-2xl font-black text-quality">{config.name}</h3>
          <p className="text-slate-500 text-sm font-black italic leading-relaxed">请闭目专注，让每一次呼吸都带走体内的疲惫。</p>
        </div>
        
        <div className="h-4"></div>
      </div>
    );
  };

  const renderGrounding = () => (
    <div className="h-full flex flex-col space-y-6 py-6 animate-in slide-in-from-bottom-8 overflow-y-auto scrollbar-hide">
      <div className="flex items-center gap-4 px-2">
        <button onClick={() => setActiveType(null)} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-slate-500 font-black">←</button>
        <div>
          <h3 className="text-2xl font-black text-quality">54321 感官着陆</h3>
          <p className="text-[10px] text-indigo-500 font-black tracking-widest uppercase">焦虑应急锚定法</p>
        </div>
      </div>
      
      <div className="space-y-4 px-2">
        {[
          { n: 5, t: '看见', s: '找出5件你能看到的东西。', i: '👁️' },
          { n: 4, t: '触摸', s: '感受4种你能触摸到的质感。', i: '✋' },
          { n: 3, t: '听见', s: '听辨3种环境中的声音。', i: '👂' },
          { n: 2, t: '闻到', s: '寻找2种不同的气味。', i: '👃' },
          { n: 1, t: '品尝', s: '专注于1种你能尝到的味道。', i: '👅' },
        ].map(item => (
          <div key={item.n} className="p-6 rounded-[2.5rem] glass border-black/5 dark:border-white/5 flex items-center gap-6 shadow-md">
            <div className="text-4xl font-black text-indigo-500/20 w-10 text-center">{item.n}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.i}</span>
                <h4 className="font-black text-quality text-sm">{item.t}</h4>
              </div>
              <p className="text-xs text-slate-500 font-black leading-snug">{item.s}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button onClick={() => setActiveType(null)} className="w-full py-6 bg-indigo-600 rounded-[2.5rem] font-black text-white text-xl shadow-2xl active:scale-95 transition-all">完成训练</button>
      <div className="h-10"></div>
    </div>
  );

  if (activeType === 'grounding') return renderGrounding();
  if (activeType) return renderSession();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-5 pl-2">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-xl text-slate-500 font-black hover:text-indigo-600 transition-colors">←</button>
        <div>
          <h2 className="text-3xl font-black text-quality">身心呼吸</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Regulate & Relax</p>
        </div>
      </div>

      <div className="grid gap-4">
        {(Object.keys(configs) as BreathingType[]).map((key) => (
          <div
            key={key}
            onClick={() => startBreathing(key)}
            className="glass p-7 rounded-[3rem] group cursor-pointer active:scale-98 transition-all hover:bg-indigo-500/5 shadow-xl border-black/5 dark:border-white/5"
          >
            <div className="flex justify-between items-center mb-6">
               <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-4xl group-hover:rotate-12 transition-transform shadow-inner">
                 {key === 'box' ? '📦' : key === 'mindful' ? '🌊' : '⚓'}
               </div>
               <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/10">Start Training</span>
            </div>
            <h4 className="text-2xl font-black text-quality mb-2">{configs[key].name}</h4>
            <p className="text-sm text-slate-500 font-black leading-relaxed">{configs[key].desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreathingHub;
