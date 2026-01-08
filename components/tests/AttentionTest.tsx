
import React, { useState, useEffect } from 'react';

const AttentionTest: React.FC<{ onFinish: (s: number) => void; onBack: () => void }> = ({ onFinish, onBack }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentTask, setCurrentTask] = useState<{ text: string, color: string }>({ text: '', color: '' });
  const [isPlaying, setIsPlaying] = useState(false);

  const colors = [
    { name: '红', hex: '#ef4444' },
    { name: '蓝', hex: '#3b82f6' },
    { name: '绿', hex: '#22c55e' },
    { name: '黄', hex: '#eab308' },
    { name: '紫', hex: '#a855f7' }
  ];

  const generateTask = () => {
    const textIdx = Math.floor(Math.random() * colors.length);
    let colorIdx = Math.floor(Math.random() * colors.length);
    // 80% chance for Stroop conflict
    if (Math.random() > 0.2 && colorIdx === textIdx) {
      colorIdx = (colorIdx + 1) % colors.length;
    }
    setCurrentTask({
      text: colors[textIdx].name,
      color: colors[colorIdx].hex
    });
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  const handleAnswer = (hex: string) => {
    if (!isPlaying) return;
    if (hex === currentTask.color) {
      setScore(s => s + 10);
    } else {
      setScore(s => Math.max(0, s - 5));
    }
    generateTask();
  };

  const start = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    generateTask();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-12">
      <div className="flex w-full justify-start absolute top-8 px-6">
        <button onClick={onBack} className="text-slate-400">退出</button>
      </div>

      {!isPlaying && timeLeft === 30 ? (
        <div className="space-y-6">
          <div className="w-24 h-24 rounded-2xl glass flex items-center justify-center text-4xl mx-auto">🎯</div>
          <h2 className="text-2xl font-bold">Stroop 注意力测试</h2>
          <p className="text-slate-400 text-sm">选择文字对应的<b>实际颜色</b>，而非文字本身的内容。</p>
          <button onClick={start} className="px-10 py-3 bg-indigo-500 rounded-full font-bold">开始</button>
        </div>
      ) : timeLeft > 0 ? (
        <div className="w-full space-y-12">
          <div className="flex justify-between items-center glass p-3 rounded-2xl">
            <span className="text-slate-400 uppercase tracking-widest text-xs">倒计时: {timeLeft}s</span>
            <span className="text-indigo-400 font-bold">得分: {score}</span>
          </div>
          
          <div className="h-32 flex items-center justify-center">
            <span 
              className="text-6xl font-black transition-all"
              style={{ color: currentTask.color }}
            >
              {currentTask.text}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {colors.map(c => (
              <button
                key={c.hex}
                onClick={() => handleAnswer(c.hex)}
                className="h-16 rounded-2xl shadow-xl transition-transform active:scale-90"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl text-slate-400">时间到！</h2>
          <div className="text-6xl font-black text-indigo-400">{score}</div>
          <div className="flex gap-4">
             <button onClick={start} className="px-8 py-3 glass rounded-full font-bold">重试</button>
             <button onClick={() => onFinish(score)} className="px-8 py-3 bg-indigo-500 rounded-full font-bold">保存</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttentionTest;
