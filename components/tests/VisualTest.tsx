
import React, { useState, useEffect } from 'react';

const VisualTest: React.FC<{ onFinish: (s: number) => void; onBack: () => void }> = ({ onFinish, onBack }) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [target, setTarget] = useState('');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);

  // High-difficulty visually similar pairs (Evil Pairs)
  const emojiSets = [
    ['🍈', '🍐'], ['🍊', '🍋'], ['🏐', '⚽'], ['🫓', '🍪'], ['🫒', '🍇'], 
    ['🧊', '💎'], ['📜', '📃'], ['🧶', '🧵'], ['🔭', '🔬'], ['🥛', '🍶'],
    ['🌳', '🌲'], ['🧁', '🍨'], ['🍤', '🍗'], ['🧂', '🕯️'], ['🥧', '🥯'],
    ['🥟', '🥯'], ['🧄', '🧅'], ['🥔', '🥝'], ['🍄', '🍞'], ['🥨', '🥐']
  ];

  const setupLevel = () => {
    const set = emojiSets[Math.floor(Math.random() * emojiSets.length)];
    // Faster grid expansion: 4x4 -> 5x5 -> 6x6 -> 7x7 -> 8x8
    const cols = level < 3 ? 4 : level < 6 ? 5 : level < 10 ? 6 : level < 15 ? 7 : 8;
    const size = cols * cols;
    const g = Array(size).fill(set[0]);
    const targetIdx = Math.floor(Math.random() * size);
    g[targetIdx] = set[1];
    setGrid(g);
    setTarget(set[1]);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  const handleSelect = (emoji: string) => {
    if (emoji === target) {
      setScore(s => s + (10 + level * 5));
      setLevel(l => l + 1);
      setupLevel();
    } else {
      setScore(s => Math.max(0, s - 15));
    }
  };

  const start = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(30);
    setIsPlaying(true);
    setupLevel();
  };

  const cols = level < 3 ? 4 : level < 6 ? 5 : level < 10 ? 6 : level < 15 ? 7 : 8;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="flex w-full justify-start absolute top-8 px-6">
        <button onClick={onBack} className="text-slate-500 font-bold">← 退出</button>
      </div>

      {!isPlaying && timeLeft === 30 ? (
        <div className="text-center space-y-8 w-full max-w-xs">
          <div className="w-24 h-24 rounded-3xl glass flex items-center justify-center text-5xl mx-auto shadow-2xl">🔍</div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">视觉搜索 (Hard)</h2>
          <p className="text-slate-500 font-bold text-sm leading-relaxed px-2">
            眼部极限挑战：在密集的网格中找出唯一的“异类”。难度随关卡指数递增。
          </p>
          <button onClick={start} className="px-12 py-5 bg-indigo-600 rounded-full font-black text-white shadow-xl active:scale-95 w-full">开始挑战</button>
        </div>
      ) : isPlaying ? (
        <div className="w-full space-y-8 max-w-sm">
          <div className="flex justify-between items-center glass p-4 rounded-3xl border-indigo-500/10">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Level {level}</span>
            <div className="flex items-center gap-4">
               <span className="text-rose-500 font-black text-lg">{timeLeft}s</span>
               <span className="text-indigo-500 font-black text-lg">{score}</span>
            </div>
          </div>
          <div 
            className="grid gap-1.5 p-2 glass rounded-[2.5rem] border-indigo-500/10 shadow-inner"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {grid.map((e, i) => (
              <button
                key={i}
                onClick={() => handleSelect(e)}
                className="aspect-square glass rounded-2xl text-2xl flex items-center justify-center active:scale-90 transition-all hover:bg-indigo-500/5"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center space-y-8 animate-in zoom-in duration-500 w-full max-w-xs">
          <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest">挑战总结</h2>
          <div className="text-8xl font-black text-indigo-500 drop-shadow-sm">{score}</div>
          <p className="text-slate-500 font-black text-sm">成功突破至 Level {level}</p>
          <div className="flex flex-col gap-3">
            <button onClick={start} className="w-full py-4 glass rounded-3xl font-black text-slate-700 dark:text-slate-300 active:scale-95">重试一次</button>
            <button onClick={() => onFinish(score)} className="w-full py-5 bg-indigo-600 rounded-3xl font-black text-white shadow-lg active:scale-95">完成练习</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualTest;
