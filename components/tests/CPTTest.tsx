
import React, { useState, useEffect, useRef } from 'react';

const CPTTest: React.FC<{ onFinish: (s: number) => void; onBack: () => void }> = ({ onFinish, onBack }) => {
  const [phase, setPhase] = useState<'intro' | 'active' | 'summary'>('intro');
  const [currentChar, setCurrentChar] = useState('');
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const letters = 'ABCDEFGHIJKLMN';
  const target = 'X';

  const startTest = () => {
    setPhase('active');
    setHits(0); setFalseAlarms(0); setTimeLeft(30);
  };

  useEffect(() => {
    if (phase === 'active') {
      const charTimer = setInterval(() => {
        const isTarget = Math.random() < 0.25;
        const nextChar = isTarget ? target : letters[Math.floor(Math.random() * letters.length)];
        setCurrentChar(nextChar);
      }, 900);

      const gameTimer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setPhase('summary');
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      return () => {
        clearInterval(charTimer);
        clearInterval(gameTimer);
      };
    }
  }, [phase]);

  const handleAction = () => {
    if (currentChar === target) {
      setHits(h => h + 1);
      setCurrentChar(''); 
    } else if (currentChar !== '') {
      setFalseAlarms(f => f + 1);
    }
  };

  const finalScore = Math.max(0, hits * 10 - falseAlarms * 5);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="flex w-full justify-start absolute top-8 px-6">
        <button onClick={onBack} className="text-slate-500 font-black hover:text-indigo-600 transition-colors">← 返回</button>
      </div>

      {phase === 'intro' && (
        <div className="space-y-10 max-w-xs">
          <div className="w-24 h-24 rounded-3xl glass flex items-center justify-center text-4xl mx-auto shadow-2xl">⏳</div>
          <h2 className="text-3xl font-black text-quality">持续注意力 (CPT)</h2>
          <p className="text-slate-500 font-black text-sm leading-relaxed">
            专注追踪：屏幕上会快速出现随机字母。<br/>只有当出现 <span className="text-indigo-600 font-black text-2xl">"X"</span> 时点击确认按钮。
          </p>
          <button onClick={startTest} className="px-14 py-5 bg-indigo-600 rounded-full font-black text-white text-xl shadow-2xl active:scale-95 w-full transition-all">开启挑战</button>
        </div>
      )}

      {phase === 'active' && (
        <div className="w-full space-y-16 max-w-sm">
          <div className="flex justify-between items-center glass p-5 rounded-[2.5rem] border-black/5 dark:border-white/5 shadow-md">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">倒计时: {timeLeft}s</span>
            <span className="text-indigo-600 font-black text-lg">捕获: {hits}</span>
          </div>
          <div key={currentChar} className="h-64 flex items-center justify-center text-[10rem] font-black animate-in zoom-in duration-150 text-quality select-none">
            {currentChar}
          </div>
          <button onClick={handleAction} className="w-full py-8 bg-indigo-600 text-white rounded-[3rem] text-3xl font-black active:scale-95 transition-all shadow-[0_20px_40px_rgba(99,102,241,0.3)]">
            捕捉 "X" !
          </button>
        </div>
      )}

      {phase === 'summary' && (
        <div className="space-y-10 w-full max-w-xs animate-in zoom-in-95">
          <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">注意力报告</h3>
          <div className="text-9xl font-black text-indigo-600 drop-shadow-2xl">{finalScore}</div>
          <div className="grid grid-cols-2 gap-4 text-xs font-black">
            <div className="glass p-5 rounded-3xl text-slate-500 shadow-sm">捕获成功: {hits}</div>
            <div className="glass p-5 rounded-3xl text-slate-500 shadow-sm">失误偏差: {falseAlarms}</div>
          </div>
          <div className="flex flex-col gap-4">
             <button onClick={startTest} className="w-full py-5 glass rounded-[2.5rem] font-black text-quality active:scale-95 border-black/5 dark:border-white/5">重试一次</button>
             <button onClick={() => onFinish(finalScore)} className="w-full py-6 bg-indigo-600 rounded-[2.5rem] font-black text-xl text-white shadow-2xl active:scale-95">确定并归档</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CPTTest;
