
import React, { useState, useEffect } from 'react';

const AttentionTest: React.FC<{ onFinish: (s: number) => void; onBack: () => void }> = ({ onFinish, onBack }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentTask, setCurrentTask] = useState<{ text: string, color: string }>({ text: '', color: '' });
  const [isPlaying, setIsPlaying] = useState(false);

  const colors = [
    { name: '红', hex: '#dc2626' },
    { name: '蓝', hex: '#2563eb' },
    { name: '绿', hex: '#16a34a' },
    { name: '黄', hex: '#ca8a04' },
    { name: '紫', hex: '#9333ea' }
  ];

  const generateTask = () => {
    const textIdx = Math.floor(Math.random() * colors.length);
    let colorIdx = Math.floor(Math.random() * colors.length);
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
        <button onClick={onBack} className="text-slate-500 font-black hover:text-indigo-600 transition-colors">← 返回</button>
      </div>

      {!isPlaying && timeLeft === 30 ? (
        <div className="space-y-8 max-w-xs">
          <div className="w-24 h-24 rounded-3xl glass flex items-center justify-center text-5xl mx-auto shadow-2xl">🎯</div>
          <h2 className="text-3xl font-black text-quality">Stroop 注意力测试</h2>
          <p className="text-slate-500 text-sm font-black leading-relaxed">
            核心目标：选出文字显示的<span className="text-indigo-600 font-black">实际颜色</span>，不要被文字本身的意义干扰。
          </p>
          <button onClick={start} className="px-14 py-5 bg-indigo-600 rounded-full font-black text-xl text-white shadow-2xl active:scale-95 w-full">开启测试</button>
        </div>
      ) : timeLeft > 0 ? (
        <div className="w-full space-y-12 max-w-sm">
          <div className="flex justify-between items-center glass p-5 rounded-[2.5rem]">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">计时: {timeLeft}s</span>
            <span className="text-indigo-600 font-black text-lg">得分: {score}</span>
          </div>
          
          <div className="h-40 flex items-center justify-center">
            <span 
              className="text-8xl font-black transition-all drop-shadow-xl select-none"
              style={{ color: currentTask.color }}
            >
              {currentTask.text}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 p-3 glass rounded-[3rem]">
            {colors.map(c => (
              <button
                key={c.hex}
                onClick={() => handleAnswer(c.hex)}
                className="h-20 rounded-[1.5rem] shadow-xl transition-all active:scale-90 border-4 border-white/10 hover:brightness-110"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8 w-full max-w-xs animate-in zoom-in-95">
          <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest">测试完成</h2>
          <div className="text-8xl font-black text-indigo-600 drop-shadow-xl">{score}</div>
          <div className="flex flex-col gap-4">
             <button onClick={start} className="w-full py-5 glass rounded-[2.5rem] font-black text-quality active:scale-95">重试</button>
             <button onClick={() => onFinish(score)} className="w-full py-6 bg-indigo-600 rounded-[2.5rem] font-black text-xl text-white shadow-2xl active:scale-95">保存数据</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttentionTest;
