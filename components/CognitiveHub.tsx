
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
    { id: 'attention' as CognitiveTestType, name: 'Stroop 注意力', emoji: '🎯', desc: '抑制干扰。' },
    { id: 'nback' as CognitiveTestType, name: '2-Back 记忆', emoji: '📦', desc: '符号位置匹配。' },
    { id: 'reaction' as CognitiveTestType, name: '简单反应时', emoji: '⚡', desc: '变色即点击。' },
    { id: 'digitspan' as CognitiveTestType, name: '数字广度 (DST)', emoji: '🔢', desc: '考察短时记忆。' },
    { id: 'cpt' as CognitiveTestType, name: '持续注意力 (CPT)', emoji: '⏳', desc: '长时间追踪目标。' },
    { id: 'gonogo' as CognitiveTestType, name: 'Go/No-go 范式', emoji: '🚦', desc: '考察抑制控制力。' },
    { id: 'visual' as CognitiveTestType, name: '视觉搜索', emoji: '🔍', desc: '快速定位异类。' },
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full glass flex items-center justify-center text-xl">←</button>
        <h2 className="text-2xl font-bold">认知训练</h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {tests.map((test) => (
          <div
            key={test.id}
            onClick={() => setActiveTest(test.id)}
            className="glass p-4 rounded-2xl flex items-center gap-4 border-white/5 cursor-pointer active:scale-98 transition-all hover:bg-white/10"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-xl">
              {test.emoji}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-sm">{test.name}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{test.desc}</p>
            </div>
            <div className="text-indigo-400 opacity-50">→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CognitiveHub;
