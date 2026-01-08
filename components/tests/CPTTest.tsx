
import React, { useState, useEffect, useRef } from 'react';

const CPTTest: React.FC<{ onFinish: (s: number) => void; onBack: () => void }> = ({ onFinish, onBack }) => {
  const [phase, setPhase] = useState<'intro' | 'active' | 'summary'>('intro');
  const [currentChar, setCurrentChar] = useState('');
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const letters = 'ABCDEFGHIJKLMN';
  const target = 'X';

  const startTest = () => {
    setPhase('active');
    setHits(0); setMisses(0); setFalseAlarms(0); setTimeLeft(30);
  };

  useEffect(() => {
    if (phase === 'active') {
      const charTimer = setInterval(() => {
        const isTarget = Math.random() < 0.25;
        const nextChar = isTarget ? target : letters[Math.floor(Math.random() * letters.length)];
        setCurrentChar(nextChar);
      }, 1000);

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
      setCurrentChar(''); // clear to avoid double clicks
    } else if (currentChar !== '') {
      setFalseAlarms(f => f + 1);
    }
  };

  const finalScore = Math.max(0, hits * 10 - falseAlarms * 5);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="flex w-full justify-start absolute top-8 px-6">
        <button onClick={onBack} className="text-slate-400">退出</button>
      </div>

      {phase === 'intro' && (
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center text-3xl mx-auto">⏳</div>
          <h2 className="text-2xl font-bold">持续注意力 CPT</h2>
          <p className="text-slate-400 text-sm">屏幕上会快速出现字母。只有当出现 <b className="text-white">"X"</b> 时点击按钮。</p>
          <button onClick={startTest} className="px-10 py-3 bg-indigo-500 rounded-full font-bold w-full">开始</button>
        </div>
      )}

      {phase === 'active' && (
        <div className="w-full space-y-12">
          <div className="flex justify-between items-center glass p-3 rounded-2xl">
            <span className="text-xs text-slate-500 uppercase tracking-widest">剩余 {timeLeft}s</span>
            <span className="text-indigo-400 font-bold">命中: {hits}</span>
          </div>
          <div key={currentChar} className="h-48 flex items-center justify-center text-9xl font-black animate-in zoom-in duration-200">
            {currentChar}
          </div>
          <button onClick={handleAction} className="w-full py-8 bg-white/5 border border-white/10 rounded-3xl text-2xl font-bold active:scale-95 transition-all">
            CLICK ON "X"
          </button>
        </div>
      )}

      {phase === 'summary' && (
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-slate-400">训练完成</h3>
          <div className="text-6xl font-black text-indigo-400">{finalScore}</div>
          <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider text-slate-500">
            <div className="glass p-2 rounded-lg">命中: {hits}</div>
            <div className="glass p-2 rounded-lg">误报: {falseAlarms}</div>
          </div>
          <button onClick={() => onFinish(finalScore)} className="w-full py-4 bg-indigo-500 rounded-full font-bold">完成并保存</button>
        </div>
      )}
    </div>
  );
};

export default CPTTest;
