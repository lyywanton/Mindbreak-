
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
        <button onClick={onBack} className="text-slate-500 font-black hover:text-indigo-600">← 返回</button>
      </div>

      {phase === 'settings' && (
        <div className="text-center space-y-8 w-full max-w-xs">
          <div className="w-24 h-24 rounded-3xl glass flex items-center justify-center text-5xl mx-auto shadow-2xl">🔢</div>
          <h2 className="text-3xl font-black text-quality">数字广度 (DST)</h2>
          <p className="text-slate-500 text-sm font-black leading-relaxed">工作记忆极限：记住屏幕上依次出现的数字。挑战你的短期记忆上限。</p>
          <div className="space-y-5">
            <p className="text-[11px] text-indigo-600 font-black uppercase tracking-[0.3em]">序列长度设定</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[3, 4, 5, 6, 7, 8].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`w-12 h-12 rounded-2xl transition-all font-black text-lg ${difficulty === d ? 'bg-indigo-600 text-white scale-110 shadow-xl' : 'glass text-slate-500 border-black/5 dark:border-white/5'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button onClick={startTest} className="px-14 py-5 bg-indigo-600 rounded-full font-black text-xl text-white w-full shadow-2xl active:scale-95">开始挑战</button>
        </div>
      )}

      {phase === 'show' && (
        <div className="text-center">
           <p className="text-slate-500 mb-4 uppercase tracking-[0.3em] text-[12px] font-black">试次 {trial} / {maxTrials}</p>
           <div key={displayIndex} className="text-[10rem] leading-none font-black text-quality animate-in zoom-in duration-300 drop-shadow-2xl">
             {sequence[displayIndex] ?? ''}
           </div>
        </div>
      )}

      {phase === 'input' && (
        <div className="w-full max-w-xs space-y-10 text-center">
          <div>
            <h3 className="text-2xl font-black text-quality mb-2">复现序列</h3>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">试次 {trial} / {maxTrials}</p>
          </div>
          <input
            autoFocus
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-black/5 dark:bg-white/5 border-2 border-indigo-500/20 rounded-[2.5rem] py-10 text-6xl text-center font-black tracking-[0.3em] text-quality focus:outline-none focus:border-indigo-600 transition-all shadow-inner"
          />
          <button onClick={handleSubmit} className="w-full py-6 bg-indigo-600 rounded-[2rem] font-black text-xl text-white shadow-2xl active:scale-95 transition-all">确认答案</button>
        </div>
      )}

      {phase === 'intermediate' && (
        <div className="text-center space-y-10 animate-in zoom-in-95">
          <div className={`text-8xl font-black ${lastTrialResult ? 'text-emerald-600' : 'text-rose-600'} drop-shadow-xl`}>
            {lastTrialResult ? '正确' : '错误'}
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-slate-500 text-sm font-black">调整呼吸，准备下一组...</p>
            <button onClick={nextStep} className="px-14 py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl shadow-2xl active:scale-95">继续 ({trial+1}/{maxTrials})</button>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="text-center space-y-8 w-full max-w-xs">
          <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest">练习总结</h2>
          <div className="text-9xl font-black text-indigo-600 drop-shadow-xl">{totalScore}</div>
          <p className="text-slate-500 font-black text-sm">正确率: {Math.round((correctTrials / maxTrials) * 100)}%</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => setPhase('settings')} className="w-full py-5 glass rounded-[2.5rem] font-black text-quality hover:bg-black/5">重试</button>
            <button onClick={() => onFinish(totalScore)} className="w-full py-6 bg-indigo-600 rounded-[2.5rem] font-black text-xl text-white shadow-2xl active:scale-95">确定并保存</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitSpanTest;
