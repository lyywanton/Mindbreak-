
import React from 'react';
import { Section } from '../types';

interface DashboardProps {
  onNavigate: (s: Section) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '早安' : hour < 18 ? '午安' : '晚安';

  const menuItems = [
    { id: 'cognitive' as Section, title: '认知训练', desc: '智力与反应', icon: '🧠', color: 'from-indigo-600/40 to-indigo-900/40', border: 'border-indigo-500/30' },
    { id: 'breathing' as Section, title: '正念呼吸', desc: '宁静与放松', icon: '🌿', color: 'from-emerald-600/40 to-emerald-900/40', border: 'border-emerald-500/30' },
    { id: 'trivia' as Section, title: '心理百科', desc: '冷知识卡牌', icon: '🃏', color: 'from-amber-600/40 to-amber-900/40', border: 'border-amber-500/30' },
    { id: 'interview' as Section, title: '面试模拟', desc: '职场对话', icon: '🎤', color: 'from-rose-600/40 to-rose-900/40', border: 'border-rose-500/30' },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-700">
      <header className="mb-8 pl-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {greeting}, <span className="text-indigo-400">MindBreak</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">随时随地的身心补给站</p>
      </header>

      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1 max-h-[480px]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`relative overflow-hidden rounded-[2.5rem] glass border ${item.border} flex flex-col items-center justify-center p-4 transition-all duration-300 active:scale-95 group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-500">{item.icon}</span>
            <h3 className="text-lg font-bold text-white relative z-10">{item.title}</h3>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest relative z-10">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 glass rounded-3xl p-5 border-white/5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-xl">💡</div>
        <p className="text-xs text-slate-300 leading-relaxed italic">
          "休息并不是在浪费时间，而是在为灵魂充电。"
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
