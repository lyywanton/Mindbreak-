
import React, { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const API_KEY = 'sk-1a664ca4d1fe425f9d510b7fe6c28306';
const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

const InterviewView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [phase, setPhase] = useState<'setup' | 'chat' | 'evaluating' | 'result'>('setup');
  const [role, setRole] = useState('');
  const [stage, setStage] = useState('初面');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isTyping, setIsTyping] = useState(false);
  const [evaluation, setEvaluation] = useState('');
  const timerRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (phase === 'chat' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleEndInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const callAI = async (currentMessages: Message[]) => {
    try {
      setIsTyping(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'qwen-flash',
          messages: currentMessages,
        })
      });
      const data = await response.json();
      setIsTyping(false);
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Error:', error);
      setIsTyping(false);
      return '抱歉，系统目前繁忙，请稍后再试。';
    }
  };

  const handleStart = async () => {
    if (!role.trim()) return;
    setPhase('chat');
    const systemPrompt: Message = {
      role: 'system',
      content: `你是一名资深的HR和面试官。现在你正在对一名应聘【${role}】岗位的候选人进行【${stage}】面试。
      面试规则：
      1. 这是一个模拟面试，限时5分钟。
      2. 每次只提一个问题，保持专业且有深度的追问。
      3. 语气要符合面试官身份，可以略带压力。
      4. 当面试时间结束或用户要求总结时，你需要给出一个0-100的打分，并总结优缺点。`
    };
    const firstQuestionPrompt = "你好，面试现在开始。请先做一个简单的自我介绍，并谈谈你为什么申请这个职位。";
    setMessages([systemPrompt, { role: 'assistant', content: firstQuestionPrompt }]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isTyping) return;
    const newMessages: Message[] = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');
    const aiResponse = await callAI(newMessages);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
  };

  const handleEndInterview = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('evaluating');
    const finalMessages: Message[] = [
      ...messages,
      { role: 'system', content: "面试时间已到或用户手动结束。请根据之前的对话，给用户一个面试表现打分（0-100），并详细总结其优点和待改进的地方。请以清晰的Markdown格式输出。" }
    ];
    const aiEval = await callAI(finalMessages);
    setEvaluation(aiEval);
    setPhase('result');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full glass flex items-center justify-center text-xl">←</button>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">面试模拟</h2>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded-md">Alpha 测试版</span>
          </div>
        </div>
        {phase === 'chat' && (
          <div className="px-4 py-2 glass rounded-2xl border-rose-500/20 text-rose-400 font-mono text-sm font-bold flex items-center gap-2">
            <span className="animate-pulse">●</span> {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {phase === 'setup' && (
        <div className="flex-1 flex flex-col justify-center space-y-8 px-2">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner">🎤</div>
            <h3 className="text-2xl font-black text-white">设置你的面试场</h3>
            <p className="text-slate-500 text-xs">AI 将根据你的设定生成专属面试官</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">应聘岗位</label>
              <input
                type="text"
                placeholder="例如：产品经理、前端开发..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">面试阶段</label>
              <div className="grid grid-cols-3 gap-2">
                {['初面', '技术面', '终面'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStage(s)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all ${stage === s ? 'bg-rose-500 text-white' : 'glass text-slate-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-2xl border-amber-500/20 bg-amber-500/5">
             <p className="text-[10px] text-amber-200/60 leading-relaxed italic">
               注意：每次对话限时5分钟。结束后系统将自动评分并给出改进建议。
             </p>
          </div>

          <button
            onClick={handleStart}
            disabled={!role.trim()}
            className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black rounded-[2rem] shadow-xl shadow-rose-900/20 transition-all active:scale-95"
          >
            开启挑战
          </button>
        </div>
      )}

      {phase === 'chat' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
            {messages.filter(m => m.role !== 'system').map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-3xl ${
                  msg.role === 'user' 
                  ? 'bg-rose-600 text-white rounded-tr-none' 
                  : 'glass text-slate-200 rounded-tl-none border-white/10'
                } text-sm leading-relaxed shadow-sm`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass p-4 rounded-3xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="mt-4 flex gap-2 items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入你的回答..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isTyping}
              className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform disabled:opacity-50"
            >
              🚀
            </button>
            <button
              onClick={handleEndInterview}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-xs text-rose-400 hover:text-rose-300"
              title="手动结束"
            >
              ⏹
            </button>
          </div>
        </div>
      )}

      {phase === 'evaluating' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-rose-500/20 rounded-full"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-rose-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-400 font-bold animate-pulse">面试官正在整理评估报告...</p>
        </div>
      )}

      {phase === 'result' && (
        <div className="flex-1 flex flex-col space-y-6 animate-in zoom-in-95 duration-500 overflow-y-auto scrollbar-hide">
          <div className="glass p-8 rounded-[3rem] border-rose-500/30 text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-400">面试评估</h3>
            <div className="text-7xl font-black text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              {evaluation.match(/\d+/)?.[0] || '80'}
            </div>
            <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">Performance Score</p>
          </div>

          <div className="glass p-6 rounded-3xl border-white/5 prose prose-invert prose-sm max-w-none text-slate-300 text-xs leading-relaxed">
             {evaluation.split('\n').map((line, i) => (
               <p key={i} className="mb-2">{line}</p>
             ))}
          </div>

          <button
            onClick={() => {
               setPhase('setup');
               setMessages([]);
               setTimeLeft(300);
            }}
            className="w-full py-4 glass rounded-[2rem] text-slate-300 font-bold hover:bg-white/5"
          >
            再次挑战
          </button>
          <div className="h-4"></div>
        </div>
      )}
    </div>
  );
};

export default InterviewView;
