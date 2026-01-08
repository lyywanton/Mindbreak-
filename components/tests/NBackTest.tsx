
import React, { useState, useEffect, useRef } from 'react';

const NBackTest: React.FC<{ onFinish: (s: number) => void; onBack: () => void }> = ({ onFinish, onBack }) => {
  const [phase, setPhase] = useState<'settings' | 'active' | 'summary'>('settings');
  const [nLevel, setNLevel] = useState(2);
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [errors, setErrors] = useState(0);
  const symbols = ['▲', '■', '●', '★', '◆', '✚'];

  const startTest = (n: number) => {
    setNLevel(n);
    const seq: string[] = [];
    for (let i = 0; i < 30; i++) {
      // 35% chance of a match for N
      if (i >= n && Math.random() < 0.35) {
        seq.push(seq[i - n]);
      } else {
        seq.push(symbols[Math.floor(Math.random() * symbols.length)]);
      }
    }
    setSequence(seq);
    setHits(0);
    setErrors(0);
    setCurrentIndex(0);
    setPhase('active');
  };

  useEffect(() => {
    if (phase === 'active') {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= 20) {
            setPhase('summary');
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleAction = () => {
    if (currentIndex < nLevel) return;
    if (sequence[currentIndex] === sequence[currentIndex - nLevel]) {
      setHits(h => h + 1);
    } else {
      setErrors(e => e + 1);
    }
  };

  const finalScore = Math.max(0, hits * 15 - errors * 5 + (nLevel - 2) * 50);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-300">
      <div className="flex w-full justify-start absolute top-8 px-6">
        <button onClick={onBack} className="text-slate-400">退出</button>
      </div>

      {phase === 'settings' && (
        <div className="space-y-8">
          <div className="w-24 h-24 rounded-2xl glass flex items-center justify-center text-4xl mx-auto shadow-2xl">📦</div>
          <h2 className="text-2xl font-bold">N-Back 记忆挑战</h2>
          <p className="text-slate-400 text-sm leading-relaxed px-4">
            符号将逐个出现。如果当前符号与<b>前第 N 个</b>符号相同，请点击“匹配”。
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[2, 3, 4].map(n => (
              <button 
                key={n}
                onClick={() => startTest(n)}
                className="py-4 glass rounded-2xl border-indigo-500/20 hover:border-indigo-500/50 active:scale-95 transition-all"
              >
                <div className="text-xl font-bold text-white">N={n}</div>
                <div className="text-[10px] text-slate-500 mt-1 uppercase">难度 {n === 2 ? '初级' : n === 3 ? '中级' : '高级'}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'active' && (
        <div className="w-full max-w-xs space-y-12">
          <div className="flex justify-between items-center text-xs font-mono text-slate-500 px-2">
            <span className="bg-indigo-500/10 px-2 py-1 rounded">模式: {nLevel}-Back</span>
            <span>进度: {currentIndex + 1} / 20</span>
          </div>
          <div key={currentIndex} className="h-48 glass rounded-[3rem] flex items-center justify-center text-8xl animate-in zoom-in-75 duration-300 shadow-2xl border-white/10">
            {sequence[currentIndex]}
          </div>
          <button 
            disabled={currentIndex < nLevel}
            onClick={handleAction}
            className={`w-full py-6 rounded-3xl text-xl font-bold transition-all shadow-xl ${
              currentIndex < nLevel ? 'bg-slate-800 text-slate-600' : 'bg-indigo-500 text-white shadow-indigo-500/20 active:scale-95'
            }`}
          >
            匹配 (Match!)
          </button>
        </div>
      )}

      {phase === 'summary' && (
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-slate-400">训练完成</h3>
          <div className="text-6xl font-black text-indigo-400">{finalScore} 分</div>
          <div className="grid grid-cols-2 gap-4 text-sm font-bold">
            <div className="glass p-4 rounded-2xl">命中: <span className="text-emerald-400">{hits}</span></div>
            <div className="glass p-4 rounded-2xl">误报: <span className="text-rose-400">{errors}</span></div>
          </div>
          <button onClick={() => onFinish(finalScore)} className="w-full py-4 bg-indigo-500 rounded-3xl font-bold text-lg shadow-lg">确定</button>
        </div>
      )}
    </div>
  );
};

export default NBackTest;
