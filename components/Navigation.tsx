
import React from 'react';
import { Section } from '../types';

interface NavigationProps {
  active: Section;
  onSelect: (s: Section) => void;
}

const Navigation: React.FC<NavigationProps> = ({ active, onSelect }) => {
  const items = [
    { id: 'home' as Section, label: '首页', icon: '🏠' },
    { id: 'cognitive' as Section, label: '训练', icon: '🧠' },
    { id: 'breathing' as Section, label: '呼吸', icon: '🫁' },
    { id: 'stats' as Section, label: '记录', icon: '📊' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 glass rounded-t-3xl flex items-center justify-around px-4 safe-area-bottom z-50">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`flex flex-col items-center justify-center transition-all duration-300 w-16 ${
            active === item.id ? 'text-indigo-400 scale-110' : 'text-slate-500'
          }`}
        >
          <span className="text-2xl mb-1">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
          {active === item.id && (
            <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
