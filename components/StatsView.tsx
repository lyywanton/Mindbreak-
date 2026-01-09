
import React, { useState, useMemo } from 'react';
import { ScoreRecord } from '../types';

interface StatsViewProps {
  scores: ScoreRecord[];
  onBack: () => void;
}

const StatsView: React.FC<StatsViewProps> = ({ scores, onBack }) => {
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [showRadar, setShowRadar] = useState(false);

  const typeMap: Record<string, { label: string; icon: string; color: string; category: string }> = {
    reaction: { label: '简单反应时', icon: '⚡', color: 'text-yellow-500', category: 'Speed' },
    nback: { label: '2-Back 记忆', icon: '📦', color: 'text-indigo-500', category: 'Memory' },
    attention: { label: 'Stroop 注意力', icon: '🎯', color: 'text-rose-500', category: 'Attention' },
    visual: { label: '视觉搜索 (Hard)', icon: '🔍', color: 'text-emerald-500', category: 'Visual' },
    digitspan: { label: '数字广度 (DST)', icon: '🔢', color: 'text-amber-500', category: 'Memory' },
    cpt: { label: '持续注意力 (CPT)', icon: '⏳', color: 'text-blue-500', category: 'Attention' },
    gonogo: { label: 'Go/No-go 范式', icon: '🚦', color: 'text-purple-500', category: 'Control' }
  };

  // Group scores by category for the radar chart
  const radarData = useMemo(() => {
    if (scores.length === 0) return null;

    const categories = {
      Memory: [] as number[],
      Attention: [] as number[],
      Control: [] as number[],
      Speed: [] as number[],
      Visual: [] as number[]
    };

    scores.forEach(s => {
      const meta = typeMap[s.type];
      if (meta) {
        let normalizedScore = s.score;
        // Special normalization for reaction time (lower is better, assuming 150ms is perfect, 500ms is poor)
        if (s.type === 'reaction') {
          normalizedScore = Math.max(0, Math.min(100, 100 - (s.score - 150) / 3.5));
        } else {
          // General normalization (capped at 100 for visual consistency)
          normalizedScore = Math.min(100, s.score / 1.5); 
        }
        (categories as any)[meta.category].push(normalizedScore);
      }
    });

    return Object.entries(categories).map(([name, vals]) => ({
      name,
      value: vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    }));
  }, [scores]);

  const RadarChart = () => {
    if (!radarData) return null;
    const size = 260;
    const center = size / 2;
    const radius = 90;
    const angleStep = (Math.PI * 2) / radarData.length;

    // Calculate vertex coordinates
    const points = radarData.map((d, i) => {
      const r = (d.value / 100) * radius;
      const x = center + r * Math.sin(i * angleStep);
      const y = center - r * Math.cos(i * angleStep);
      return `${x},${y}`;
    }).join(' ');

    const webCircles = [0.2, 0.4, 0.6, 0.8, 1].map(rScale => {
      const r = radius * rScale;
      return radarData.map((_, i) => {
        const x = center + r * Math.sin(i * angleStep);
        const y = center - r * Math.cos(i * angleStep);
        return `${x},${y}`;
      }).join(' ');
    });

    return (
      <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in duration-500">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-2xl">
          {/* Background Web */}
          {webCircles.map((p, i) => (
            <polygon key={i} points={p} fill="none" stroke="currentColor" className="text-slate-500/20" strokeWidth="1" />
          ))}
          {/* Axis lines */}
          {radarData.map((_, i) => {
            const x = center + radius * Math.sin(i * angleStep);
            const y = center - radius * Math.cos(i * angleStep);
            return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="currentColor" className="text-slate-500/20" strokeWidth="1" />;
          })}
          {/* Active Data Area */}
          <polygon 
            points={points} 
            fill="rgba(99, 102, 241, 0.3)" 
            stroke="#6366f1" 
            strokeWidth="3" 
            strokeLinejoin="round" 
            className="animate-pulse"
          />
          {/* Labels */}
          {radarData.map((d, i) => {
            const r = radius + 30;
            const x = center + r * Math.sin(i * angleStep);
            const y = center - r * Math.cos(i * angleStep);
            return (
              <text 
                key={i} 
                x={x} y={y} 
                textAnchor="middle" 
                className="text-[10px] font-black fill-slate-500 uppercase tracking-tighter"
                dominantBaseline="middle"
              >
                {d.name}
              </text>
            );
          })}
        </svg>
        <div className="mt-4 text-center">
           <h3 className="text-lg font-black text-quality">认知雷达图</h3>
           <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Multi-dimensional Analysis</p>
        </div>
      </div>
    );
  };

  const groupedScores = scores.reduce((acc, score) => {
    if (!acc[score.type]) acc[score.type] = [];
    acc[score.type].push(score);
    return acc;
  }, {} as Record<string, ScoreRecord[]>);

  Object.keys(groupedScores).forEach(type => {
    groupedScores[type].sort((a, b) => b.date - a.date);
  });

  const toggleExpand = (type: string) => {
    setExpandedType(expandedType === type ? null : type);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 pb-16">
      <div className="flex items-center gap-5 pl-2">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-xl text-slate-500 font-black hover:text-indigo-600 transition-colors">←</button>
        <div>
          <h2 className="text-3xl font-black text-quality">训练档案</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Performance Records</p>
        </div>
      </div>

      {scores.length === 0 ? (
        <div className="py-32 text-center space-y-8">
          <div className="text-8xl opacity-10 animate-pulse grayscale">📈</div>
          <div className="space-y-3">
            <p className="text-slate-500 font-black text-lg">暂无脑力训练数据</p>
            <p className="text-xs text-slate-400 font-black leading-relaxed px-12 italic">完成任意认知训练后，系统将在此为你生成专属能力成长曲线。</p>
          </div>
          <button onClick={onBack} className="px-12 py-5 bg-indigo-600 rounded-full font-black text-white shadow-2xl active:scale-95 transition-all">开启首次挑战</button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Radar Chart Section */}
          <div className="glass p-8 rounded-[3.5rem] border-black/5 dark:border-white/5 shadow-2xl overflow-hidden">
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.4em]">维度洞察 (Radar)</h4>
                <button 
                  onClick={() => setShowRadar(!showRadar)}
                  className="text-[10px] font-black text-slate-500 uppercase px-3 py-1 glass rounded-full"
                >
                  {showRadar ? '隐藏图表' : '查看画像'}
                </button>
             </div>
             {showRadar ? <RadarChart /> : (
                <div className="grid grid-cols-2 gap-8 py-4">
                  <div className="space-y-2">
                    <div className="text-4xl font-black text-quality">{scores.length}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">总计练次数</div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="text-4xl font-black text-emerald-500">
                       {Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length)}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">平均表现分</div>
                  </div>
                </div>
             )}
          </div>

          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4 mt-10">详细任务历史</h4>
          
          <div className="space-y-4">
            {Object.keys(typeMap).map((type) => {
              const taskScores = groupedScores[type] || [];
              if (taskScores.length === 0) return null;

              const isExpanded = expandedType === type;
              const meta = typeMap[type];
              const avgScore = Math.round(taskScores.reduce((a, b) => a + b.score, 0) / taskScores.length);

              return (
                <div key={type} className={`glass overflow-hidden rounded-[2.5rem] transition-all duration-400 border-black/5 dark:border-white/5 shadow-md ${isExpanded ? 'ring-2 ring-indigo-500/20' : ''}`}>
                  <button 
                    onClick={() => toggleExpand(type)}
                    className="w-full p-6 flex items-center gap-5 active:bg-black/5 dark:active:bg-white/5 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-3xl bg-slate-900 flex items-center justify-center text-2xl shadow-inner">
                      {meta.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-black text-quality text-base">{meta.label}</div>
                      <div className="text-[10px] text-slate-500 mt-1 font-black uppercase tracking-wider">{taskScores.length} 次已完成记录</div>
                    </div>
                    <div className="text-right mr-3">
                       <div className={`text-xl font-black ${meta.color}`}>{avgScore}</div>
                       <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest">AVG.</div>
                    </div>
                    <div className={`text-slate-400 transition-transform duration-300 font-bold ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 space-y-3 border-t border-black/5 dark:border-white/5 animate-in slide-in-from-top-3">
                      {taskScores.map((s) => (
                        <div key={s.id} className="flex justify-between items-center py-4 border-b border-black/[0.03] dark:border-white/[0.03] last:border-0">
                          <div className="text-[12px] text-slate-500 font-black">
                            {new Date(s.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })} <span className="opacity-30 ml-2">{new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className={`font-black text-base ${meta.color}`}>{s.score}</div>
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
      <div className="h-6"></div>
    </div>
  );
};

export default StatsView;
