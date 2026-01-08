
import React, { useState, useEffect } from 'react';
import { Section, ScoreRecord } from './types';
import Dashboard from './components/Dashboard';
import CognitiveHub from './components/CognitiveHub';
import BreathingHub from './components/BreathingHub';
import StatsView from './components/StatsView';
import Navigation from './components/Navigation';
import TriviaView from './components/TriviaView';
import InterviewView from './components/InterviewView';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
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
      case 'stats':
        return <StatsView scores={scores} onBack={() => setActiveSection('home')} />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-slate-950 relative overflow-hidden shadow-2xl border-x border-white/10">
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6 scrollbar-hide">
        {renderContent()}
      </main>

      {!showSplash && <Navigation active={activeSection} onSelect={setActiveSection} />}
    </div>
  );
};

export default App;
