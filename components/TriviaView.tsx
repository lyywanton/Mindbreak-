
import React, { useState, useEffect } from 'react';

const triviaData = [
  { title: "聚光灯效应", fact: "你以为大家都在盯着你？其实没人在意。", description: "我们往往会高估他人对我们的关注程度。实际上，每个人都更关心自己，你担心的尴尬瞬间可能根本没人注意到。" },
  { title: "蔡格尼克效应", fact: "未完成的任务总是让你念念不忘。", description: "大脑会自动优先处理未完成的信息。这就是为什么没看完的电影、没做完的工作总是在你脑海中挥之不去。" },
  { title: "巴纳姆效应", fact: "为什么你会觉得星座描述得特别准？", description: "人们倾向于认为那些笼统、泛泛的性格描述十分准确地揭示了自己的特点。这种心理暗示让你把通用的描述套在了自己身上。" },
  { title: "投射效应", fact: "你眼中的别人，其实是你自己。", description: "我们常常下意识地认为别人也具备和自己一样的特质或想法。当你觉得别人在撒谎时，也许是因为你自己正在不安。" },
  { title: "吊桥效应", fact: "心跳加速不一定是爱，也可能是恐惧。", description: "在危险或刺激环境下产生的心跳加速，常被大脑误解为对身边人的好感。危险时刻产生的“情愫”可能只是生理唤醒的错觉。" },
  { title: "狄德罗效应", fact: "买了一件新衣服，就想换掉全套行头。", description: "拥有一件新物品后，为了配套而不断配置与其档次相当的新物品的心理倾向。这种欲望链条会让你陷入过度消费。" },
  { title: "破窗效应", fact: "坏习惯如果不及时纠正，就会迅速蔓延。", description: "环境中的微小混乱如果没有得到修复，会诱发人们产生“这里没人管”的心理暗示，从而导致更大的破坏行为。" },
  { title: "聚群偏差", fact: "为什么总觉得刚好学到的词到处都是？", description: "一旦注意到某件新鲜事物，大脑就会在无意识中频繁筛选相关信息，让你产生它正在“高频出现”的错觉。" },
  { title: "邓宁-克鲁格效应", fact: "越无知的人往往越自信。", description: "认知偏差的一种。能力欠缺的人由于无法正确评估自己，往往会产生虚假的优越感，而真正的专家反而更容易低估自己。" },
  { title: "皮格马利翁效应", fact: "期待会带来真实的改变。", description: "赞美、信任和期待具有改变人的能量。当你真心相信某人能做到时，这种积极的心理暗示真的能提升对方的表现。" },
  { title: "单纯暴露效应", fact: "仅仅是经常露面，就能增加好感度。", description: "我们会仅仅因为一个事物变得熟悉而更喜欢它。这解释了为什么广告要重复播放，或者为什么你会喜欢上经常见面的同事。" },
  { title: "光环效应", fact: "长得好看的人，看起来也更聪明。", description: "当我们发现某人具备一个优秀特质（如高颜值）时，会倾向于认为他其他方面（如品德、智力）同样出色。" },
  { title: "旁观者效应", fact: "人越多的时候，你反而越不安全。", description: "在紧急情况下，旁观者越多，每个人承担的责任感就越被稀释，导致没有人站出来提供帮助。" },
  { title: "损失厌恶", fact: "丢掉100块的痛苦远大于捡到100块的快乐。", description: "人们对损失的敏感度远高于对收益的敏感度。这种心理让你在决策时往往因为害怕失败而错失良机。" },
  { title: "宜家效应", fact: "亲手做的东西，总是感觉更好用。", description: "人们倾向于高估由自己投入劳动而创造的产品的价值。即使成品并不完美，你也会因为它流过你的汗水而更爱它。" },
  { title: "证实偏差", fact: "你只看你想看的，听你想听的。", description: "我们会下意识地寻找并相信那些支持我们既有观点的信息，而忽略甚至排斥那些反驳我们的证据。" },
  { title: "幸存者偏差", fact: "别只盯着那些成功人士的经验谈。", description: "我们往往只关注那些在某种筛选中“幸存”下来的人或物，而忽略了那些沉默的大多数失败者，从而得出错误的因果关系。" },
  { title: "基本归因错误", fact: "别人迟到是人品差，我迟到是堵车了。", description: "解释别人行为时，我们倾向于归结为性格原因；解释自己行为时，则倾向于归结为环境和外在因素。" },
  { title: "沉没成本谬误", fact: "哪怕电影再难看，买都买了还是看完吧。", description: "我们会为了已经发生、且无法收回的投入（时间、金钱）而继续做那些让自己不开心或不再有价值的事。" },
  { title: "禀赋效应", fact: "一旦拥有，它的价值就翻倍了。", description: "当一个人拥有某项物品时，他对该物品价值的评价会比未拥有时显著提高。这种心态让你难以舍弃旧物。" }
];

const TriviaView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [shuffledDeck, setShuffledDeck] = useState<typeof triviaData>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const shuffleDeck = () => {
    // 1. Start the blur animation immediately on the CURRENT card
    setIsRefreshing(true);
    
    // 2. Wait until the card is sufficiently blurred (around 200ms) before swapping data
    setTimeout(() => {
      const deck = [...triviaData].sort(() => Math.random() - 0.5);
      setShuffledDeck(deck);
      setCurrentIndex(0);
    }, 200);

    // 3. Clear the refresh state after the total transition time
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  useEffect(() => {
    // Initial shuffle
    const deck = [...triviaData].sort(() => Math.random() - 0.5);
    setShuffledDeck(deck);
  }, []);

  if (shuffledDeck.length === 0) return null;
  const current = shuffledDeck[currentIndex];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      <header className="flex items-center justify-between mb-8 pr-2 shrink-0">
        <div className="flex items-center gap-5 pl-2">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-xl text-slate-500 font-black">←</button>
          <div>
            <h2 className="text-3xl font-black text-quality">心理百科</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">Insight & Psychology</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pr-20"> 
          <button 
            onClick={shuffleDeck}
            className={`w-12 h-12 glass rounded-2xl border-indigo-500/20 shadow-lg flex items-center justify-center transition-all active:scale-90 ${isRefreshing ? 'opacity-50 pointer-events-none' : ''}`}
            title="换一叠卡片"
          >
            <span className="text-2xl">🔄</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-2 relative">
        <div 
          key={shuffledDeck[0]?.title} // Change key when deck changes to trigger entrance animation
          className={`w-full max-w-sm glass rounded-[3.5rem] p-10 border-indigo-500/10 shadow-2xl relative z-10 overflow-hidden min-h-[460px] flex flex-col justify-between transition-all duration-300 ${isRefreshing ? 'blur-2xl scale-95 opacity-0 grayscale pointer-events-none' : 'animate-in zoom-in-95'}`}
        >
          <div className="absolute top-0 right-0 p-8 text-7xl opacity-[0.03] select-none font-black italic text-quality">Insight</div>
          
          <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Knowledge Archive</span>
            </div>
            <h3 className="text-3xl font-black text-quality mb-6 leading-tight">{current.title}</h3>
            <p className="text-lg font-black text-amber-600 dark:text-amber-200/90 leading-relaxed italic border-l-4 border-indigo-500/30 pl-6">{current.fact}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/10">
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-black">{current.description}</p>
          </div>
        </div>

        {!isRefreshing && (
          <div className="w-full max-w-sm mt-10 space-y-6 animate-in slide-in-from-bottom-4">
            <div className="px-6">
              <input 
                type="range"
                min="0"
                max={shuffledDeck.length - 1}
                value={currentIndex}
                onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between mt-3 px-1">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">卡片进度</span>
                 <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{currentIndex + 1} / {shuffledDeck.length}</span>
              </div>
            </div>

            <div className="flex gap-4">
               <button onClick={() => setCurrentIndex(p => Math.max(0, p - 1))} className="flex-1 py-5 glass rounded-[2rem] text-quality font-black active:scale-95 border-black/5 dark:border-white/5 transition-all">上一张</button>
               <button onClick={() => setCurrentIndex(p => Math.min(shuffledDeck.length - 1, p + 1))} className="flex-[2] py-5 bg-indigo-600 text-white font-black rounded-[2.5rem] shadow-2xl active:scale-95 transition-all">下一张 (Next)</button>
            </div>
          </div>
        )}
      </div>
      <div className="h-4 shrink-0"></div>
    </div>
  );
};

export default TriviaView;
