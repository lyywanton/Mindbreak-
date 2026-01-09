
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
          if (prev >= 25) {
            setPhase('summary');
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
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
        <button onClick={onBack} className="text-slate-500 font-black hover:text-indigo-600 transition-colors">← 返回</button>
      </div>

      {phase === 'settings' && (
        <div className="space-y-8">
          <div className="w-24 h-24 rounded-3xl glass flex items-center justify-center text-5xl mx-auto shadow-2xl">📦</div>
          <h2 className="text-3xl font-black text-quality">N-Back 记忆挑战</h2>
          <p className="text-slate-500 text-sm leading-relaxed px-4 font-black">
            如果当前符号与前第 N 个符号相同，<br/>请迅速点击下方匹配按钮。
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[2, 3, 4].map(n => (
              <button 
                key={n}
                onClick={() => startTest(n)}
                className="py-5 glass rounded-[2rem] border-indigo-500/20 hover:border-indigo-500/50 active:scale-95 transition-all"
              >
                <div className="text-2xl font-black text-indigo-600">N={n}</div>
                <div className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest">{n === 2 ? '初级' : n === 3 ? '进阶' : '专家'}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'active' && (
        <div className="w-full max-w-xs space-y-12">
          <div className="flex justify-between items-center text-[11px] font-black text-slate-500 px-2 uppercase tracking-widest">
            <span className="bg-indigo-600/10 text-indigo-600 px-3 py-1 rounded-full">模式: {nLevel}-Back</span>
            <span>进度: {currentIndex + 1} / 25</span>
          </div>
          <div key={currentIndex} className="h-64 glass rounded-[3.5rem] flex items-center justify-center text-9xl animate-in zoom-in-75 duration-300 shadow-2xl border-indigo-500/10 text-quality">
            {sequence[currentIndex]}
          </div>
          <button 
            disabled={currentIndex < nLevel}
            onClick={handleAction}
            className={`w-full py-7 rounded-[2rem] text-2xl font-black transition-all shadow-xl ${
              currentIndex < nLevel ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white shadow-indigo-500/30 active:scale-95'
            }`}
          >
            匹配 (Match!)
          </button>
        </div>
      )}

      {phase === 'summary' && (
        <div className="space-y-8 w-full max-w-xs">
          <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">训练记录</h3>
          <div className="text-8xl font-black text-indigo-600 drop-shadow-xl">{finalScore}</div>
          <div className="grid grid-cols-2 gap-4 text-xs font-black">
            <div className="glass p-5 rounded-3xl text-slate-500">命中: <span className="text-emerald-600 text-lg ml-1">{hits}</span></div>
            <div className="glass p-5 rounded-3xl text-slate-500">误报: <span className="text-rose-600 text-lg ml-1">{errors}</span></div>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <button onClick={() => setPhase('settings')} className="w-full py-5 glass rounded-[2rem] font-black text-quality hover:bg-black/5 active:scale-95 transition-all">重新挑战</button>
            <button onClick={() => onFinish(finalScore)} className="w-full py-6 bg-indigo-600 rounded-[2rem] font-black text-xl text-white shadow-2xl active:scale-95">确定并保存成绩</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NBackTest;
