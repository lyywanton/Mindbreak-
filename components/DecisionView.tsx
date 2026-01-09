
import React, { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const API_KEY = 'sk-1a664ca4d1fe425f9d510b7fe6c28306';
const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

type Phase = 'input' | 'selection' | 'simulating' | 'reasoning' | 'verdict';

const DecisionView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [phase, setPhase] = useState<Phase>('input');
  const [problem, setProblem] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [options, setOptions] = useState<{ a: string, b: string }>({ a: '', b: '' });
  const [currentSim, setCurrentSim] = useState<'a' | 'b' | null>(null);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, options]);

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
      return '脑回路卡住了，请重新输入。';
    }
  };

  const handleStart = async () => {
    if (!problem.trim()) return;
    setPhase('selection');
    const systemPrompt: Message = {
      role: 'system',
      content: `你是一个深谙心理学的抉择专家。
      当前任务：分析用户的纠结点，并提取出两个最核心的选择。
      要求：
      1. 简短地分析用户的心理原因，不超过50字。
      2. 提取两个具体的选项。
      格式：[心理分析] ### [选项A] ### [选项B]`
    };
    const userMsg: Message = { role: 'user', content: problem };
    const newMsgs = [systemPrompt, userMsg];
    setMessages(newMsgs);
    
    const response = await callAI(newMsgs);
    const parts = response.split('###');
    const analysis = parts[0]?.trim();
    const optA = parts[1]?.trim();
    const optB = parts[2]?.trim();

    setMessages([...newMsgs, { role: 'assistant', content: analysis || "我理解你的纠结。我们来仔细剖析这两个方向。" }]);
    setOptions({ a: optA || '选择一', b: optB || '选择二' });
  };

  const handleSimulate = async (choice: 'a' | 'b') => {
    setCurrentSim(choice);
    const label = choice === 'a' ? options.a : options.b;
    const simMsg: Message = { 
      role: 'system', 
      content: `模拟选择：${label}。简要说明这一选择的【可能结果】、【主要优点】和【核心代价】。严禁使用Markdown（不要#或*），保持纯文本，每项一行，语气犀利。` 
    };
    
    const response = await callAI([...messages, simMsg]);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setPhase('simulating');
  };

  const goToReasoning = () => {
    setMessages(prev => [...prev, { role: 'assistant', content: "看过两种可能，你现在内心最担心的具体是什么？或者有什么我没捕捉到的细节？" }]);
    setPhase('reasoning');
  };

  const handleFinalVerdict = async () => {
    if (!userInput.trim()) return;
    const userReason: Message = { role: 'user', content: userInput };
    const newMsgs = [...messages, userReason];
    setMessages(newMsgs);
    setUserInput('');
    setPhase('verdict');

    const finalPrompt: Message = {
      role: 'system',
      content: "根据之前的模拟和用户现在的真实想法，给出一个最适合当下的最终选择建议。语气要犀利、肯定，不要模棱两可。严禁Markdown，纯文本输出。100字以内。"
    };
    const response = await callAI([...newMsgs, finalPrompt]);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      <div className="flex items-center gap-5 pl-2 mb-6 shrink-0">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-xl text-slate-500 font-black hover:text-cyan-600 transition-colors">←</button>
        <div>
          <h2 className="text-2xl font-black text-quality leading-tight">灵魂抉择馆</h2>
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-md">Pure Decision Logic</span>
        </div>
      </div>

      {phase === 'input' ? (
        <div className="flex-1 flex flex-col justify-center space-y-10 px-2">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-cyan-500/10 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner">⚖️</div>
            <h3 className="text-3xl font-black text-quality">你在纠结什么？</h3>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest leading-relaxed">不必隐晦，直接说出你眼前的两个难点</p>
          </div>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="例如：是该留在安逸的家乡，还是去北京闯荡？"
            className="w-full h-40 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2rem] p-6 text-quality font-black focus:outline-none focus:border-cyan-500 transition-all shadow-inner resize-none"
          />
          <button
            onClick={handleStart}
            disabled={!problem.trim()}
            className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-black text-xl rounded-[2.5rem] shadow-2xl transition-all active:scale-95"
          >
            开启抉择流程
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-5 pr-2 scrollbar-hide pb-10">
            {messages.filter(m => m.role !== 'system').map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-300`}>
                <div className={`max-w-[85%] p-5 rounded-[2.5rem] ${
                  msg.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-tr-none shadow-xl' 
                  : 'glass text-quality rounded-tl-none border-black/5 dark:border-white/10 shadow-md'
                } text-sm leading-relaxed font-black`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass p-5 rounded-[2rem] rounded-tl-none flex gap-1.5 shadow-sm border-black/5 dark:border-white/5">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
            
            {phase === 'selection' && options.a && !isTyping && (
              <div className="flex flex-col gap-4 mt-4 animate-in fade-in duration-500">
                <p className="text-center text-[10px] text-slate-500 font-black uppercase tracking-widest">请选择一个维度进行模拟</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleSimulate('a')} className="p-5 glass border-cyan-500/20 rounded-[1.5rem] text-sm font-black text-quality hover:bg-cyan-500/10 active:scale-95 transition-all text-center h-24 flex items-center justify-center">{options.a}</button>
                  <button onClick={() => handleSimulate('b')} className="p-5 glass border-cyan-500/20 rounded-[1.5rem] text-sm font-black text-quality hover:bg-cyan-500/10 active:scale-95 transition-all text-center h-24 flex items-center justify-center">{options.b}</button>
                </div>
              </div>
            )}

            {phase === 'simulating' && !isTyping && (
              <div className="flex flex-col gap-4 mt-4 animate-in fade-in duration-500">
                 <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleSimulate(currentSim === 'a' ? 'b' : 'a')} 
                    className="p-5 glass border-cyan-500/20 rounded-[1.5rem] text-xs font-black text-quality hover:bg-cyan-500/10 active:scale-95 transition-all text-center"
                  >
                    查看另一个选项: {currentSim === 'a' ? options.b : options.a}
                  </button>
                  <button 
                    onClick={goToReasoning}
                    className="p-5 bg-cyan-600 text-white rounded-[1.5rem] text-xs font-black shadow-lg active:scale-95 transition-all text-center"
                  >
                    我都看过了，进入深层剖析
                  </button>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          {phase === 'reasoning' && (
            <div className="mt-4 flex gap-3 items-center pb-2 shrink-0 animate-in slide-in-from-bottom-5">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFinalVerdict()}
                placeholder="说出你内心最纠结的一个点..."
                className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-6 py-4 text-sm text-quality font-black focus:outline-none focus:border-cyan-500 transition-all"
              />
              <button
                onClick={handleFinalVerdict}
                disabled={!userInput.trim() || isTyping}
                className="w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center text-white shadow-2xl active:scale-90 transition-all disabled:opacity-50"
              >
                🚀
              </button>
            </div>
          )}

          {phase === 'verdict' && !isTyping && (
            <button
              onClick={() => {setPhase('input'); setProblem(''); setMessages([]);}}
              className="mt-4 w-full py-6 glass border-cyan-500/20 text-cyan-600 font-black rounded-[2.5rem] active:scale-95 shadow-xl transition-all"
            >
              换个命题重新抉择
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionView;
