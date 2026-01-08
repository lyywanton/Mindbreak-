
import React, { useState, useEffect } from 'react';

const DigitSpanTest: React.FC<{ onFinish: (s: number) => void; onBack: () => void }> = ({ onFinish, onBack }) => {
  const [phase, setPhase] = useState<'settings' | 'show' | 'input' | 'intermediate' | 'result'>('settings');
  const [difficulty, setDifficulty] = useState(4);
  const [trial, setTrial] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState('');
  const [displayIndex, setDisplayIndex] = useState(-1);
  const [correctTrials, setCorrectTrials] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lastTrialResult, setLastTrialResult] = useState<boolean | null>(null);

  const maxTrials = 5;

  const startNextTrial = () => {
    const seq = Array.from({ length: difficulty }, () => Math.floor(Math.random() * 10));
    setSequence(seq);
    setUserInput('');
    setDisplayIndex(0);
    setPhase('show');
  };

  const startTest = () => {
    setTrial(1);
    setCorrectTrials(0);
    setTotalScore(0);
    startNextTrial();
  };

  useEffect(() => {
    if (phase === 'show' && displayIndex < sequence.length) {
      const timer = setTimeout(() => {
        setDisplayIndex(displayIndex + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'show' && displayIndex === sequence.length) {
      setPhase('input');
    }
  }, [phase, displayIndex, sequence]);

  const handleSubmit = () => {
    const isCorrect = userInput === sequence.join('');
    if (isCorrect) {
      setCorrectTrials(prev => prev + 1);
      setTotalScore(prev => prev + difficulty * 10);
    }
    setLastTrialResult(isCorrect);
    
    if (trial < maxTrials) {
      setPhase('intermediate');
    } else {
      setPhase('result');
    }
  };

  const nextStep = () => {
    setTrial(prev => prev + 1);
    startNextTrial();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in">
      <div className="flex w-full justify-start absolute top-8 px-6">
        <button onClick={onBack} className="text-slate-400">退出</button>
      </div>

      {phase === 'settings' && (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">数字广度 DST</h2>
          <p className="text-slate-400 text-sm">记住出现的数字序列。本轮共 {maxTrials} 个试次。</p>
          <div className="space-y-2">
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">选择难度 (数字长度)</p>
            <div className="flex gap-2 justify-center">
              {[3, 4, 5, 6, 7, 8].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`w-10 h-10 rounded-xl transition-all ${difficulty === d ? 'bg-indigo-500 text-white scale-110' : 'glass text-slate-500'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button onClick={startTest} className="px-10 py-3 bg-indigo-500 rounded-full font-bold w-full shadow-lg shadow-indigo-500/20">开始练习</button>
        </div>
      )}

      {phase === 'show' && (
        <div className="text-center">
           <p className="text-slate-500 mb-2 uppercase tracking-[0.2em] text-xs font-bold">试次 {trial} / {maxTrials}</p>
           <p className="text-indigo-400/50 mb-8 text-[10px]">请注视屏幕</p>
           <div key={displayIndex} className="text-9xl font-black text-white animate-in zoom-in duration-300">
             {sequence[displayIndex] ?? ''}
           </div>
        </div>
      )}

      {phase === 'input' && (
        <div className="w-full space-y-6 text-center">
          <h3 className="text-lg font-bold">请输入序列 ({trial}/{maxTrials})</h3>
          <input
            autoFocus
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 text-4xl text-center font-black tracking-[0.5em] focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button onClick={handleSubmit} className="px-10 py-3 bg-indigo-500 rounded-full font-bold w-full">提交</button>
        </div>
      )}

      {phase === 'intermediate' && (
        <div className="text-center space-y-8 animate-in zoom-in-95">
          <div className={`text-6xl font-black ${lastTrialResult ? 'text-emerald-400' : 'text-rose-400'}`}>
            {lastTrialResult ? '正确' : '错误'}
          </div>
          <p className="text-slate-400 text-sm">准备好进行下一个试次吗？</p>
          <button onClick={nextStep} className="px-12 py-4 bg-white text-slate-900 rounded-full font-bold text-lg">继续 ({trial+1}/{maxTrials})</button>
        </div>
      )}

      {phase === 'result' && (
        <div className="text-center space-y-6">
          <h2 className="text-xl text-slate-400">训练完成</h2>
          <div className="text-7xl font-black text-indigo-400">{totalScore}</div>
          <p className="text-slate-300">正确率: {Math.round((correctTrials / maxTrials) * 100)}%</p>
          <div className="flex gap-4">
            <button onClick={() => setPhase('settings')} className="px-8 py-3 glass rounded-full">重试</button>
            <button onClick={() => onFinish(totalScore)} className="px-8 py-3 bg-indigo-500 rounded-full font-bold">保存成绩</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitSpanTest;
