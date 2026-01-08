
import React, { useState, useEffect } from 'react';
import { BreathingType } from '../types';

const BreathingHub: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeType, setActiveType] = useState<BreathingType | null>(null);
  const [step, setStep] = useState<'In' | 'Hold' | 'Out' | 'Hold2'>('In');
  const [timer, setTimer] = useState(0);

  const configs = {
    box: { name: '盒子呼吸 (4-4-4-4)', desc: '用于快速冷静，平衡身心。', steps: [4, 4, 4, 4], labels: ['深深吸气', '屏住呼吸', '缓缓呼气', '保持空灵'] },
    mindful: { name: '正念呼吸 (5-0-7-0)', desc: '专注气流，减少压力。', steps: [5, 0, 7, 0], labels: ['鼻腔吸气', '', '悠长呼气', ''] },
    grounding: { name: '54321 感官着陆', desc: '焦虑时的紧急锚定法。', steps: [], labels: [] }
  };

  useEffect(() => {
    if (activeType && activeType !== 'grounding') {
      const config = configs[activeType];
      let currentStepIdx = 0;
      setStep('In');
      setTimer(config.steps[0]);

      const interval = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            currentStepIdx = (currentStepIdx + 1) % 4;
            let nextTime = config.steps[currentStepIdx];
            if (nextTime === 0) {
              currentStepIdx = (currentStepIdx + 1) % 4;
              nextTime = config.steps[currentStepIdx];
            }
            const labelsMap: any = { 0: 'In', 1: 'Hold', 2: 'Out', 3: 'Hold2' };
            setStep(labelsMap[currentStepIdx]);
            return nextTime;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeType]);

  const renderBreathCircle = () => {
    const config = configs[activeType as 'box' | 'mindful'];
    const labelsMap: any = { 'In': config.labels[0], 'Hold': config.labels[1], 'Out': config.labels[2], 'Hold2': config.labels[3] };
    const phase = step === 'In' ? 'expand' : step === 'Out' ? 'shrink' : 'hold';
    
    // Calculate precise transition duration based on the step time to match seconds
    const durationSeconds = step === 'In' ? config.steps[0] : step === 'Out' ? config.steps[2] : 1;
    const transitionStyle = { transitionDuration: `${durationSeconds}s` };

    return (
      <div className="h-full flex flex-col items-center justify-center space-y-16 animate-in fade-in duration-1000 px-4">
        <div className="relative flex items-center justify-center w-full max-w-xs aspect-square">
          <div className={`absolute w-full h-full rounded-full blur-[80px] transition-all opacity-30 ${
            phase === 'expand' ? 'bg-indigo-400 scale-125' : phase === 'shrink' ? 'bg-emerald-400 scale-75' : 'bg-slate-400 scale-100'
          }`} style={transitionStyle}></div>

          <div className="relative flex gap-6">
            {[0, 1].map(i => (
              <div
                key={i}
                style={{ 
                  ...transitionStyle,
                  transform: phase === 'expand' ? 'scale(1.3) translateY(-15px)' : phase === 'shrink' ? 'scale(0.65) translateY(10px)' : 'scale(1) translateY(0)'
                }}
                className={`w-28 h-40 rounded-full transition-all ease-in-out border border-white/5 ${
                  phase === 'expand' ? 'bg-gradient-to-b from-indigo-300/30 to-indigo-600/10' : phase === 'shrink' ? 'bg-gradient-to-b from-emerald-300/30 to-emerald-600/10' : 'bg-white/5'
                } shadow-[0_0_40px_rgba(255,255,255,0.05)]`}
              ></div>
            ))}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-xs font-black tracking-[0.2em] text-white/40 uppercase mb-3 drop-shadow-sm">{labelsMap[step]}</div>
            <div key={step + timer} className="text-6xl font-black text-white drop-shadow-md animate-in zoom-in-50 duration-200">{timer}</div>
          </div>
        </div>

        <div className="text-center px-4">
          <h3 className="text-xl font-bold text-white tracking-wide">{config.name}</h3>
          <p className="text-slate-500 mt-2 text-sm italic">请跟随动画节奏，尝试感受气流进出肺部...</p>
        </div>

        <button onClick={() => setActiveType(null)} className="px-12 py-4 glass rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all active:scale-95 font-medium">结束本次训练</button>
      </div>
    );
  };

  const renderGrounding = () => (
    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-8 overflow-y-auto max-h-full scrollbar-hide">
       <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setActiveType(null)} className="w-10 h-10 rounded-full glass flex items-center justify-center">←</button>
        <h3 className="text-xl font-bold text-white">54321 感官着陆法</h3>
      </div>
      <p className="text-xs text-slate-500 mb-6 px-1 leading-relaxed">
        这是一项专业的心理锚定练习。通过调动五感，它可以帮助过度活跃的大脑强行带回现实，有效缓解惊恐与压力。
      </p>
      <div className="space-y-4">
        {[
          { n: 5, t: '视觉观察', s: '在周围找出5件你可以清楚看到的东西。', d: '仔细观察它们的细节：颜色、影子、或者是微小的划痕。', c: 'border-indigo-500/30' },
          { n: 4, t: '触觉感受', s: '感受4种你能够直接触摸到的质感。', d: '如布料的纹理、手机壳的冰凉、或者是手心相碰的温度。', c: 'border-emerald-500/30' },
          { n: 3, t: '听觉追踪', s: '闭上眼，在寂静中找出3种微弱的声音。', d: '窗外的远方声响、空调的运作声，甚至是自己的心跳。', c: 'border-amber-500/30' },
          { n: 2, t: '嗅觉捕捉', s: '深吸气，寻找2种不同的气味。', d: '如果没有明显气味，可以闻闻自己的掌心，或者想象雨后泥土的气味。', c: 'border-rose-500/30' },
          { n: 1, t: '味觉体验', s: '最后，专注捕捉1种你能尝到的味道。', d: '可能是残留的清晨咖啡味，或者是舌尖滑过牙龈的平实触感。', c: 'border-teal-500/30' },
        ].map(item => (
          <div key={item.n} className={`p-6 rounded-[2rem] border bg-white/[0.02] ${item.c} flex items-start gap-4 transition-all hover:bg-white/[0.05]`}>
            <div className="text-5xl font-black opacity-10 leading-none select-none">{item.n}</div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-2">{item.t}</h4>
              <p className="text-xs text-indigo-100/90 mb-2 leading-snug">{item.s}</p>
              <p className="text-[10px] text-slate-500 italic leading-relaxed">{item.d}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setActiveType(null)} className="w-full py-5 mt-6 bg-indigo-500 rounded-[2rem] font-black text-white shadow-2xl shadow-indigo-500/30 active:scale-95 transition-transform">我已经平静下来了</button>
      <div className="h-8"></div>
    </div>
  );

  if (activeType === 'grounding') return renderGrounding();
  if (activeType) return renderBreathCircle();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full glass flex items-center justify-center text-xl">←</button>
        <h2 className="text-2xl font-bold text-white">身心呼吸</h2>
      </div>

      <div className="grid gap-4">
        {(Object.keys(configs) as BreathingType[]).map((key) => (
          <div
            key={key}
            onClick={() => setActiveType(key)}
            className="glass p-6 rounded-[2.5rem] group cursor-pointer active:scale-98 transition-all border-white/5 hover:bg-white/5"
          >
            <div className="flex justify-between items-center mb-4">
               <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform shadow-inner">
                 {key === 'box' ? '📦' : key === 'mindful' ? '🌊' : '⚓'}
               </div>
               <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest bg-indigo-400/10 px-3 py-1 rounded-full">Guide</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-1">{configs[key].name}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{configs[key].desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreathingHub;
