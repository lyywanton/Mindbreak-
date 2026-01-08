
import React, { useState, useEffect } from 'react';

const GoNoGoTest: React.FC<{ onFinish: (s: number) => void; onBack: () => void }> = ({ onFinish, onBack }) => {
  const [phase, setPhase] = useState<'intro' | 'active' | 'summary'>('intro');
  const [stimulus, setStimulus] = useState<'go' | 'nogo' | null>(null);
  const [score, setScore] = useState(0);
  const [trials, setTrials] = useState(0);
  const [correctGo, setCorrectGo] = useState(0);
  const [falseAlarm, setFalseAlarm] = useState(0);
  const totalTrials = 20;

  const nextTrial = () => {
    if (trials >= totalTrials) {
      setPhase('summary');
      return;
    }
    setStimulus(null);
    setTimeout(() => {
      const isGo = Math.random() < 0.7; // Go trials are more frequent to build response prep
      setStimulus(isGo ? 'go' : 'nogo');
      setTrials(t => t + 1);
    }, 800 + Math.random() * 700);
  };

  useEffect(() => {
    if (phase === 'active') {
      nextTrial();
    }
  }, [phase]);

  useEffect(() => {
    if (stimulus) {
      const timer = setTimeout(() => {
        // If it was a No-go and they didn't click, that's good!
        if (stimulus === 'nogo') {
          // implicit success
        }
        setStimulus(null);
        if (phase === 'active') nextTrial();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [stimulus]);

  const handleAction = () => {
    if (!stimulus) return;
    if (stimulus === 'go') {
      setCorrectGo(c => c + 1);
    } else {
      setFalseAlarm(f => f + 1);
    }
    setStimulus(null);
    nextTrial();
  };

  const finalScore = Math.max(0, correctGo * 10 - falseAlarm * 15);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="flex w-full justify-start absolute top-8 px-6">
        <button onClick={onBack} className="text-slate-400">退出</button>
      </div>

      {phase === 'intro' && (
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-full glass flex items-center justify-center text-3xl mx-auto">🚦</div>
          <h2 className="text-2xl font-bold">Go/No-go 范式</h2>
          <p className="text-slate-400 text-sm">看到 <span className="text-emerald-400">绿色圆形</span> 时尽快点击。看到 <span className="text-rose-400">红色正方形</span> 时保持克制，不要点击。</p>
          <button onClick={() => setPhase('active')} className="px-10 py-3 bg-indigo-500 rounded-full font-bold w-full">开始测试</button>
        </div>
      )}

      {phase === 'active' && (
        <div className="w-full space-y-12">
          <div className="text-xs text-slate-500 uppercase tracking-widest">进度: {trials}/{totalTrials}</div>
          <div className="h-64 flex items-center justify-center">
            {stimulus === 'go' && (
              <div onClick={handleAction} className="w-48 h-48 rounded-full bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-in zoom-in duration-100 cursor-pointer"></div>
            )}
            {stimulus === 'nogo' && (
              <div onClick={handleAction} className="w-48 h-48 rounded-2xl bg-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.4)] animate-in zoom-in duration-100 cursor-pointer"></div>
            )}
          </div>
          <div className="text-slate-600 text-[10px] uppercase font-mono">如果是绿色，请点击屏幕</div>
        </div>
      )}

      {phase === 'summary' && (
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-slate-400">完成</h3>
          <div className="text-6xl font-black text-indigo-400">{finalScore}</div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 uppercase font-bold">
            <div className="glass p-2 rounded-lg">反应正确: {correctGo}</div>
            <div className="glass p-2 rounded-lg">克制失败: {falseAlarm}</div>
          </div>
          <button onClick={() => onFinish(finalScore)} className="w-full py-4 bg-indigo-500 rounded-full font-bold">确定</button>
        </div>
      )}
    </div>
  );
};

export default GoNoGoTest;
