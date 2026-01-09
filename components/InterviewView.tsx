
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  content: string;
}

const InterviewView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [phase, setPhase] = useState<'setup' | 'chat' | 'evaluating' | 'result'>('setup');
  const [role, setRole] = useState('');
  const [stage, setStage] = useState('初面');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); 
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

  const getSystemInstruction = (isEval = false) => {
    if (isEval) {
      return `你是一名资深的职业教练。请根据刚才的模拟面试对话，对候选人进行深度复盘。
      要求：
      1. 给出 0-100 的综合评分。
      2. 总结 3 个表现亮点。
      3. 提出 2 个具体的改进建议（如逻辑性、专业词汇使用、自信度）。
      4. 保持客观、专业。格式采用 Markdown，但不要使用过大的标题。`;
    }

    return `你是一名资深的 HR 面试官。你正在面试应聘【${role}】岗位的候选人，当前是【${stage}】阶段。
    
    面试行为准则（极重要）：
    1. **言简意赅**：你的话必须非常精炼，每次回复严禁超过 60 字。
    2. **人设固定**：专业、冷静、略带权威感。不要过分客气，也不要解释你为什么这么问。
    3. **引导追问**：不要直接告诉用户该说什么。如果用户回答模糊，请通过“你能举个具体的例子吗？”或“在这个过程中你遇到了什么困难？”这种方式引导其深入回答（引导其使用 STAR 原则）。
    4. **单点突破**：每次只提一个问题，确保对话逻辑连贯。
    5. **即时反馈**：可以用一句话对用户的上一个回答做极简评价（如“这个思路很清晰”、“这个案例稍显单薄”），然后立即进入下一个问题。`;
  };

  const callGemini = async (history: Message[], isEval = false) => {
    try {
      setIsTyping(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      
      const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          systemInstruction: getSystemInstruction(isEval),
          temperature: isEval ? 0.7 : 0.9,
          topP: 0.95,
        },
      });

      setIsTyping(false);
      return response.text || '面试官陷入了沉思，请稍后。';
    } catch (error) {
      console.error('Gemini Error:', error);
      setIsTyping(false);
      return '由于信号不稳定，面试官请求您稍后再试。';
    }
  };

  const handleStart = async () => {
    if (!role.trim()) return;
    setPhase('chat');
    
    const firstQuestion = "你好。请先做一个简短的自我介绍，并重点说明你为何认为自己胜任【" + role + "】这个岗位。";
    setMessages([{ role: 'model', content: firstQuestion }]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isTyping) return;
    
    const newMessages: Message[] = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');
    
    const aiResponse = await callGemini(newMessages);
    setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
  };

  const handleEndInterview = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('evaluating');
    
    // 增加一条提示指令引导生成总结
    const finalHistory: Message[] = [...messages, { role: 'user', content: "面试结束，请给我整体评价。" }];
    const aiEval = await callGemini(finalHistory, true);
    setEvaluation(aiEval);
    setPhase('result');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-6 pr-2 shrink-0">
        <div className="flex items-center gap-5 pl-2">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-xl text-slate-500 font-black hover:text-rose-600 transition-colors">←</button>
          <div>
            <h2 className="text-2xl font-black text-quality leading-tight">面试模拟</h2>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded-md inline-block">Pro Session</p>
          </div>
        </div>
        {phase === 'chat' && (
          <div className="px-5 py-3 glass rounded-2xl border-rose-500/30 text-rose-500 font-mono text-sm font-black flex items-center gap-2 shadow-lg">
            <span className="animate-pulse">●</span> {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {phase === 'setup' && (
        <div className="flex-1 overflow-y-auto space-y-10 px-2 scrollbar-hide pb-20">
          <div className="text-center space-y-4 pt-4">
            <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner">🎤</div>
            <h3 className="text-3xl font-black text-quality">设定职场战场</h3>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Gemini 3 驱动的专业面试训练</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">应聘目标岗位</label>
              <input
                type="text"
                placeholder="例如：产品经理、前端开发、市场专员..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2rem] p-5 text-quality font-black focus:outline-none focus:border-rose-500 transition-all shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">面试演练阶段</label>
              <div className="grid grid-cols-3 gap-3">
                {['初面', '技术面', '终面'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStage(s)}
                    className={`py-4 rounded-2xl text-xs font-black transition-all ${stage === s ? 'bg-rose-600 text-white shadow-lg scale-105' : 'glass text-slate-500 border-black/5 dark:border-white/5'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-5 rounded-[2.5rem] border-rose-500/10 bg-rose-500/5">
             <p className="text-[11px] text-slate-500 leading-relaxed italic font-black text-center">
               面试官会针对你的回答进行追问。请尝试使用 <span className="text-rose-600">STAR 法则</span> (情境、任务、行动、结果) 来组织你的语言。
             </p>
          </div>

          <button
            onClick={handleStart}
            disabled={!role.trim()}
            className="w-full py-6 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black text-xl rounded-[2.5rem] shadow-2xl shadow-rose-900/30 transition-all active:scale-95"
          >
            开启专业对话
          </button>
        </div>
      )}

      {phase === 'chat' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-300`}>
                <div className={`max-w-[85%] p-5 rounded-[2.2rem] ${
                  msg.role === 'user' 
                  ? 'bg-rose-600 text-white rounded-tr-none shadow-xl' 
                  : 'glass text-quality rounded-tl-none border-black/5 dark:border-white/10 shadow-md'
                } text-sm leading-relaxed font-black`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass p-5 rounded-[1.8rem] rounded-tl-none flex gap-1.5 shadow-sm border-black/5 dark:border-white/5">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="mt-5 flex gap-3 items-center pb-2 shrink-0">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="沉稳回答面试官提问..."
              className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-6 py-4 text-sm text-quality font-black focus:outline-none focus:border-rose-500 transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isTyping}
              className="w-14 h-14 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-2xl active:scale-90 transition-all disabled:opacity-50"
            >
              <span className="text-xl">↑</span>
            </button>
            <button
              onClick={handleEndInterview}
              className="w-12 h-12 glass rounded-full flex items-center justify-center text-lg text-rose-500 border-rose-500/20 shadow-md active:scale-90 transition-all"
              title="提交面试"
            >
              ✓
            </button>
          </div>
        </div>
      )}

      {phase === 'evaluating' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            <div className="w-32 h-32 border-[6px] border-rose-500/10 rounded-full"></div>
            <div className="absolute inset-0 w-32 h-32 border-[6px] border-rose-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-quality font-black text-xl animate-pulse">正在生成面试报告</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Analyzing your performance...</p>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="flex-1 flex flex-col space-y-6 animate-in zoom-in-95 duration-500 overflow-y-auto scrollbar-hide pb-10">
          <div className="glass p-10 rounded-[4rem] border-rose-500/20 text-center space-y-5 shadow-2xl shrink-0">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">面试综合得分</h3>
            <div className="text-9xl font-black text-rose-600 drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              {evaluation.match(/\d+/)?.[0] || '85'}
            </div>
            <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase italic">Practice makes perfect</p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-black/5 dark:border-white/5 prose dark:prose-invert max-w-none text-quality text-sm leading-relaxed font-black shadow-md">
             {evaluation.split('\n').map((line, i) => (
               <p key={i} className="mb-3">{line}</p>
             ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                 setPhase('setup');
                 setMessages([]);
                 setTimeLeft(300);
              }}
              className="flex-1 py-6 glass rounded-[2.5rem] text-quality font-black text-lg hover:bg-black/5 shadow-lg active:scale-95 transition-all"
            >
              重新演练
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-6 bg-rose-600 text-white rounded-[2.5rem] font-black text-lg shadow-xl active:scale-95 transition-all"
            >
              完成退出
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewView;
