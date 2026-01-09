
import React, { useState, useRef } from 'react';

const ReactionTest: React.FC<{ onFinish: (s: number) => void; onBack: () => void }> = ({ onFinish, onBack }) => {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState(0);
  const timerRef = useRef<number | null>(null);

  const startTest = () => {
    setState('waiting');
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = window.setTimeout(() => {
      setState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      alert('太快了！请在变色后点击。');
      setState('idle');
      return;
    }
    if (state === 'ready') {
      const reactionTime = Date.now() - startTime;
      setResult(reactionTime);
      setState('result');
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex w-full justify-start absolute top-8 px-6">
        <button onClick={onBack} className="text-slate-500 font-bold">← 退出</button>
      </div>

      {state === 'idle' && (
        <div className="space-y-8">
          <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-500/10 flex items-center justify-center text-6xl mx-auto shadow-inner">⚡</div>
          <h2 className="text-2xl font-black text-white">反应力测试</h2>
          <p className="text-slate-500 font-bold px-4 leading-relaxed">屏幕由蓝变绿时，<br/>请以最快速度点击屏幕中心。</p>
          <button onClick={startTest} className="px-12 py-4 bg-indigo-600 rounded-full font-black text-white shadow-xl active:scale-95">开始测试</button>
        </div>
      )}

      {(state === 'waiting' || state === 'ready') && (
        <div 
          onClick={handleClick}
          className={`w-full h-80 rounded-[3rem] flex items-center justify-center cursor-pointer transition-all duration-150 ${
            state === 'waiting' ? 'bg-indigo-600/20' : 'bg-emerald-500 scale-105 shadow-[0_0_80px_rgba(16,185,129,0.3)] animate-pulse'
          }`}
        >
          <span className="text-3xl font-black text-white uppercase tracking-widest">
            {state === 'waiting' ? '准备中...' : '现在点击！'}
          </span>
        </div>
      )}

      {state === 'result' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <h2 className="text-6xl font-black text-indigo-500 drop-shadow-sm">{result} ms</h2>
          <p className="text-slate-500 font-black uppercase tracking-widest text-sm">卓越的神经反应</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => setState('idle')} className="px-10 py-3 glass rounded-full font-black text-slate-500 active:scale-95">重新测试</button>
            <button onClick={() => onFinish(result)} className="px-10 py-3 bg-indigo-600 rounded-full font-black text-white shadow-lg active:scale-95">保存数据</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionTest;
