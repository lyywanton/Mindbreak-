
import React, { useState, useEffect } from 'react';

const VisualTest: React.FC<{ onFinish: (s: number) => void; onBack: () => void }> = ({ onFinish, onBack }) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [target, setTarget] = useState('');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);

  const emojiSets = [
    ['🍎', '🍏'], ['🐱', '🐶'], ['🌕', '🌑'], ['❤️', '💔'], ['😀', '😎'], ['🔥', '❄️']
  ];

  const setupLevel = () => {
    const set = emojiSets[Math.floor(Math.random() * emojiSets.length)];
    const size = level < 3 ? 9 : level < 6 ? 16 : 25;
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
      setScore(s => s + 20);
      setLevel(l => l + 1);
      setupLevel();
    } else {
      setScore(s => Math.max(0, s - 10));
    }
  };

  const start = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(30);
    setIsPlaying(true);
    setupLevel();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="flex w-full justify-start absolute top-8 px-6">
        <button onClick={onBack} className="text-slate-400">退出</button>
      </div>

      {!isPlaying && timeLeft === 30 ? (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-2xl glass flex items-center justify-center text-4xl mx-auto">🔍</div>
          <h2 className="text-2xl font-bold">视觉搜索</h2>
          <p className="text-slate-400">找出网格中唯一的那个“异类”。</p>
          <button onClick={start} className="px-10 py-3 bg-indigo-500 rounded-full font-bold">开始</button>
        </div>
      ) : isPlaying ? (
        <div className="w-full space-y-8">
          <div className="flex justify-between items-center glass p-3 rounded-2xl">
            <span className="text-xs text-slate-500">LEVEL {level}</span>
            <span className="text-indigo-400 font-bold">{timeLeft}s / {score}pts</span>
          </div>
          <div className={`grid ${level < 3 ? 'grid-cols-3' : level < 6 ? 'grid-cols-4' : 'grid-cols-5'} gap-2`}>
            {grid.map((e, i) => (
              <button
                key={i}
                onClick={() => handleSelect(e)}
                className="h-16 glass rounded-xl text-3xl flex items-center justify-center active:bg-white/10"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-black text-indigo-400">{score}</h2>
          <p className="text-slate-400">训练有素的眼力！</p>
          <div className="flex gap-4">
            <button onClick={start} className="px-8 py-3 glass rounded-full">重试</button>
            <button onClick={() => onFinish(score)} className="px-8 py-3 bg-indigo-500 rounded-full font-bold">完成</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualTest;
