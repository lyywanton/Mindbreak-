
import React, { useState, useRef } from 'react';

const ReactionTest: React.FC<{ onFinish: (s: number) => void; onBack: () => void }> = ({ onFinish, onBack }) => {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState(0);
  const timerRef = useRef<number | null>(null);

  const startTest = () => {
    setState('waiting');
    const delay = 2000 + Math.random() * 3000;
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
        <button onClick={onBack} className="text-slate-400">退出</button>
      </div>

      {state === 'idle' && (
        <div className="space-y-6">
          <div className="w-48 h-48 rounded-full bg-indigo-500/10 flex items-center justify-center text-6xl mx-auto">⚡</div>
          <h2 className="text-2xl font-bold text-white">反应力测试</h2>
          <p className="text-slate-400">点击下方按钮开始。屏幕由蓝变绿时，请尽可能快地点击。</p>
          <button onClick={startTest} className="px-8 py-3 bg-indigo-500 rounded-full font-bold">开始</button>
        </div>
      )}

      {(state === 'waiting' || state === 'ready') && (
        <div 
          onClick={handleClick}
          className={`w-full h-80 rounded-3xl flex items-center justify-center cursor-pointer transition-colors duration-200 ${
            state === 'waiting' ? 'bg-slate-800' : 'bg-emerald-500 animate-pulse'
          }`}
        >
          <span className="text-2xl font-bold text-white">
            {state === 'waiting' ? '等待变色...' : '点击！！'}
          </span>
        </div>
      )}

      {state === 'result' && (
        <div className="space-y-6">
          <h2 className="text-4xl font-black text-indigo-400">{result} ms</h2>
          <p className="text-slate-400">相当不错的反应速度！</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setState('idle')} className="px-6 py-2 glass rounded-full">重试</button>
            <button onClick={() => onFinish(result)} className="px-6 py-2 bg-indigo-500 rounded-full font-bold">保存并返回</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionTest;
