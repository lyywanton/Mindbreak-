
import React, { useState } from 'react';
import { CognitiveTestType } from '../types';
import ReactionTest from './tests/ReactionTest';
import NBackTest from './tests/NBackTest';
import AttentionTest from './tests/AttentionTest';
import VisualTest from './tests/VisualTest';
import DigitSpanTest from './tests/DigitSpanTest';
import CPTTest from './tests/CPTTest';
import GoNoGoTest from './tests/GoNoGoTest';

interface CognitiveHubProps {
  onComplete: (type: string, score: number) => void;
  onBack: () => void;
}

const CognitiveHub: React.FC<CognitiveHubProps> = ({ onComplete, onBack }) => {
  const [activeTest, setActiveTest] = useState<CognitiveTestType | null>(null);

  const tests = [
    { id: 'attention' as CognitiveTestType, name: 'Stroop 注意力', emoji: '🎯', desc: '抑制干扰训练。' },
    { id: 'nback' as CognitiveTestType, name: '2-Back 记忆', emoji: '📦', desc: '符号位置匹配。' },
    { id: 'reaction' as CognitiveTestType, name: '简单反应时', emoji: '⚡', desc: '变色即点击。' },
    { id: 'digitspan' as CognitiveTestType, name: '数字广度 (DST)', emoji: '🔢', desc: '考察短时记忆。' },
    { id: 'cpt' as CognitiveTestType, name: '持续注意力 (CPT)', emoji: '⏳', desc: '长时间追踪目标。' },
    { id: 'gonogo' as CognitiveTestType, name: 'Go/No-go 范式', emoji: '🚦', desc: '考察抑制控制力。' },
    { id: 'visual' as CognitiveTestType, name: '视觉搜索 (Hard)', emoji: '🔍', desc: '快速定位微小异类。' },
  ];

  const handleFinish = (type: string, score: number) => {
    onComplete(type, score);
    setActiveTest(null);
  };

  if (activeTest === 'reaction') return <ReactionTest onFinish={(s) => handleFinish('reaction', s)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'nback') return <NBackTest onFinish={(s) => handleFinish('nback', s)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'attention') return <AttentionTest onFinish={(s) => handleFinish('attention', s)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'visual') return <VisualTest onFinish={(s) => handleFinish('visual', s)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'digitspan') return <DigitSpanTest onFinish={(s) => handleFinish('digitspan', s)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'cpt') return <CPTTest onFinish={(s) => handleFinish('cpt', s)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'gonogo') return <GoNoGoTest onFinish={(s) => handleFinish('gonogo', s)} onBack={() => setActiveTest(null)} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-5 pl-2">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-xl text-slate-500 font-black hover:text-indigo-600 transition-colors">←</button>
        <div>
          <h2 className="text-3xl font-black text-quality">认知训练</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Cognitive Enhancement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tests.map((test) => (
          <div
            key={test.id}
            onClick={() => setActiveTest(test.id)}
            className="glass p-6 rounded-[2.5rem] flex items-center gap-5 border-black/5 dark:border-white/5 cursor-pointer active:scale-[0.98] transition-all hover:bg-indigo-500/5 group shadow-md"
          >
            <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform shadow-inner">
              {test.emoji}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-quality text-lg">{test.name}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 font-black uppercase tracking-wider">{test.desc}</p>
            </div>
            <div className="text-indigo-400 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-xl font-bold">→</div>
          </div>
        ))}
      </div>
      <div className="h-4"></div>
    </div>
  );
};

export default CognitiveHub;
