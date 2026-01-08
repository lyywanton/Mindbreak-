
import React, { useState } from 'react';
import { ScoreRecord } from '../types';

interface StatsViewProps {
  scores: ScoreRecord[];
  onBack: () => void;
}

const StatsView: React.FC<StatsViewProps> = ({ scores, onBack }) => {
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const typeMap: Record<string, { label: string; icon: string; color: string }> = {
    reaction: { label: '反应时测试', icon: '⚡', color: 'text-yellow-400' },
    nback: { label: 'N-Back 记忆', icon: '📦', color: 'text-indigo-400' },
    attention: { label: 'Stroop 注意力', icon: '🎯', color: 'text-rose-400' },
    visual: { label: '视觉搜索', icon: '🔍', color: 'text-emerald-400' },
    digitspan: { label: '数字广度 (DST)', icon: '🔢', color: 'text-amber-400' },
    cpt: { label: '持续注意力 (CPT)', icon: '⏳', color: 'text-blue-400' },
    gonogo: { label: 'Go/No-go 范式', icon: '🚦', color: 'text-purple-400' }
  };

  const groupedScores = scores.reduce((acc, score) => {
    if (!acc[score.type]) acc[score.type] = [];
    acc[score.type].push(score);
    return acc;
  }, {} as Record<string, ScoreRecord[]>);

  // Sort each group by date descending
  Object.keys(groupedScores).forEach(type => {
    groupedScores[type].sort((a, b) => b.date - a.date);
  });

  const toggleExpand = (type: string) => {
    setExpandedType(expandedType === type ? null : type);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 pb-10">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full glass flex items-center justify-center text-xl">←</button>
        <h2 className="text-2xl font-bold text-white">训练档案</h2>
      </div>

      {scores.length === 0 ? (
        <div className="py-24 text-center space-y-6">
          <div className="text-7xl opacity-10 animate-pulse">📈</div>
          <div className="space-y-2">
            <p className="text-slate-400 font-medium">还没有任何训练数据</p>
            <p className="text-xs text-slate-600">点击“训练”板块开启你的第一次认知提升之旅</p>
          </div>
          <button onClick={onBack} className="px-8 py-3 bg-indigo-500 rounded-full font-bold text-sm">去训练</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass p-6 rounded-[2rem] bg-indigo-500/5 border-indigo-500/20">
             <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">概览总结</h4>
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                 <div className="text-3xl font-black text-white">{scores.length}</div>
                 <div className="text-[10px] text-slate-500 uppercase font-bold">总练习次数</div>
               </div>
               <div className="space-y-1">
                 <div className="text-3xl font-black text-emerald-400">
                    {Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length)}
                 </div>
                 <div className="text-[10px] text-slate-500 uppercase font-bold">加权平均表现</div>
               </div>
             </div>
          </div>

          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 mt-8">按任务分类记录</h4>
          
          <div className="space-y-3">
            {Object.keys(typeMap).map((type) => {
              const taskScores = groupedScores[type] || [];
              if (taskScores.length === 0) return null;

              const isExpanded = expandedType === type;
              const meta = typeMap[type];
              const avgScore = Math.round(taskScores.reduce((a, b) => a + b.score, 0) / taskScores.length);

              return (
                <div key={type} className={`glass overflow-hidden rounded-3xl transition-all duration-300 border-white/5 ${isExpanded ? 'ring-1 ring-white/10' : ''}`}>
                  <button 
                    onClick={() => toggleExpand(type)}
                    className="w-full p-5 flex items-center gap-4 active:bg-white/5 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-xl shadow-inner">
                      {meta.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-white text-sm">{meta.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{taskScores.length} 次训练记录</div>
                    </div>
                    <div className="text-right mr-2">
                       <div className={`text-lg font-black ${meta.color}`}>{avgScore}</div>
                       <div className="text-[8px] text-slate-600 uppercase font-bold">平均分</div>
                    </div>
                    <div className={`text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 space-y-2 border-t border-white/5 animate-in slide-in-from-top-2">
                      {taskScores.map((s) => (
                        <div key={s.id} className="flex justify-between items-center py-3 border-b border-white/[0.03] last:border-0">
                          <div className="text-[11px] text-slate-400 font-medium">
                            {new Date(s.date).toLocaleDateString()} <span className="opacity-30 ml-2">{new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className={`font-black text-sm ${meta.color}`}>{s.score}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsView;
