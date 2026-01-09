
import React from 'react';
import { Section } from '../types';

interface DashboardProps {
  onNavigate: (s: Section) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '早安' : hour < 18 ? '午安' : '晚安';

  const menuItems = [
    { id: 'cognitive' as Section, title: '认知训练', desc: '智力与反应', icon: '🧠', color: 'from-indigo-600/40 to-indigo-900/40', border: 'border-indigo-500/20' },
    { id: 'breathing' as Section, title: '正念呼吸', desc: '宁静与放松', icon: '🌿', color: 'from-emerald-600/40 to-emerald-900/40', border: 'border-emerald-500/20' },
    { id: 'trivia' as Section, title: '心理百科', desc: '冷知识卡牌', icon: '🃏', color: 'from-amber-600/40 to-amber-900/40', border: 'border-amber-500/20' },
    { id: 'interview' as Section, title: '面试模拟', desc: '职场对话', icon: '🎤', color: 'from-rose-600/40 to-rose-900/40', border: 'border-rose-500/20' },
    { id: 'decision' as Section, title: '灵魂抉择馆', desc: '终结纠结', icon: '⚖️', color: 'from-cyan-600/40 to-cyan-900/40', border: 'border-cyan-500/20' },
    { id: 'home' as Section, title: '敬请期待', desc: '更多精彩', icon: '✨', color: 'from-slate-600/40 to-slate-900/40', border: 'border-slate-500/20', disabled: true },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-700">
      <header className="mb-6 pl-2">
        <h1 className="text-4xl font-black tracking-tight text-quality">
          {greeting}, <span className="text-indigo-600 dark:text-indigo-400">MindBreak</span>
        </h1>
        <p className="text-slate-500 text-sm mt-2 font-black uppercase tracking-widest">提升你的大脑潜能</p>
      </header>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => !item.disabled && onNavigate(item.id)}
            className={`relative overflow-hidden rounded-[2rem] glass border ${item.border} flex flex-col items-center justify-center p-4 transition-all duration-300 ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 group shadow-xl'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 ${!item.disabled && 'group-hover:opacity-20'} transition-opacity`}></div>
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">{item.icon}</span>
            <h3 className="text-lg font-black text-quality relative z-10">{item.title}</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest relative z-10 font-black">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 glass rounded-[2rem] p-4 border-black/5 dark:border-white/5 flex items-center gap-4 shadow-inner">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-2xl shadow-sm">💡</div>
        <p className="text-xs text-slate-500 leading-relaxed italic font-black">
          "每一次专注，都是在重塑你的大脑神经元。"
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
