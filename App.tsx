
import React, { useState, useEffect } from 'react';
import { Section, ScoreRecord } from './types';
import Dashboard from './components/Dashboard';
import CognitiveHub from './components/CognitiveHub';
import BreathingHub from './components/BreathingHub';
import StatsView from './components/StatsView';
import Navigation from './components/Navigation';
import TriviaView from './components/TriviaView';
import InterviewView from './components/InterviewView';
import DecisionView from './components/DecisionView';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const getBeijingHour = () => {
    try {
      const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Shanghai', hour: 'numeric', hour12: false };
      return parseInt(new Intl.DateTimeFormat('en-GB', options).format(new Date()));
    } catch (e) {
      return new Date().getHours();
    }
  };

  useEffect(() => {
    // Initial theme detection based on Beijing Time (8:00 - 18:00 is light)
    const hour = getBeijingHour();
    const defaultTheme = (hour >= 8 && hour < 18) ? 'light' : 'dark';
    setTheme(defaultTheme);

    const saved = localStorage.getItem('mindbreak_scores');
    if (saved) {
      try {
        setScores(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load scores", e);
      }
    }
  }, []);

  const addScore = (type: string, score: number) => {
    const newRecord: ScoreRecord = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      score,
      date: Date.now()
    };
    const updated = [...scores, newRecord];
    setScores(updated);
    localStorage.setItem('mindbreak_scores', JSON.stringify(updated));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <Dashboard onNavigate={setActiveSection} />;
      case 'cognitive':
        return <CognitiveHub onComplete={addScore} onBack={() => setActiveSection('home')} />;
      case 'breathing':
        return <BreathingHub onBack={() => setActiveSection('home')} />;
      case 'trivia':
        return <TriviaView onBack={() => setActiveSection('home')} />;
      case 'interview':
        return <InterviewView onBack={() => setActiveSection('home')} />;
      case 'decision':
        return <DecisionView onBack={() => setActiveSection('home')} />;
      case 'stats':
        return <StatsView scores={scores} onBack={() => setActiveSection('home')} />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className={`flex flex-col h-screen w-full max-w-md mx-auto relative overflow-hidden shadow-2xl transition-all duration-500 ${theme === 'light' ? 'theme-light bg-slate-50' : 'theme-dark bg-slate-950 border-x border-white/10'}`}>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} theme={theme} />}
      
      {/* Theme Toggle Button - Fixed Top Right */}
      {!showSplash && (
        <button 
          onClick={toggleTheme}
          className="absolute top-6 right-6 z-[100] w-12 h-12 glass rounded-2xl flex items-center justify-center text-xl shadow-xl active:scale-90 transition-all border-white/20"
          title="切换日夜模式"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      )}

      {/* Dynamic Background Effects */}
      <div className={`absolute top-[-5%] left-[-5%] w-80 h-80 rounded-full blur-[100px] -z-10 animate-pulse-slow ${theme === 'light' ? 'bg-indigo-400/20' : 'bg-indigo-600/10'}`}></div>
      <div className={`absolute bottom-[-5%] right-[-5%] w-96 h-96 rounded-full blur-[100px] -z-10 animate-pulse-slow ${theme === 'light' ? 'bg-emerald-400/10' : 'bg-emerald-600/10'}`} style={{ animationDelay: '3s' }}></div>

      <main className="flex-1 overflow-y-auto pb-28 px-4 pt-6 scrollbar-hide relative z-10 text-quality">
        {renderContent()}
      </main>

      {!showSplash && <Navigation active={activeSection} onSelect={setActiveSection} />}
    </div>
  );
};

export default App;
