
import React, { useState, useEffect, useMemo } from 'react';

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
  { title: "禀赋效应", fact: "一旦拥有，它的价值就翻倍了。", description: "当一个人拥有某项物品时，他对该物品价值的评价会比未拥有时显著提高。这种心态让你难以割舍旧物。" },
  { title: "踢猫效应", fact: "坏情绪也会向下传染。", description: "人常会将不满的情绪发泄给等级比自己低或力量比自己弱的对象，这种负能量的传递最终可能伤害到最无辜的人。" },
  { title: "心流体验", fact: "忘掉时间、忘掉自我的极度专注。", description: "当你全身心投入一项极具挑战性且技能匹配的任务时，会产生一种效率极高、充满愉悦感的意识状态。" },
  { title: "过度理由效应", fact: "给兴趣发奖金，反而会毁掉兴趣。", description: "当一个原本出于兴趣的行为得到了过多的外部奖励时，人们会将行为动力转变为为了奖励，从而降低了内在的积极性。" },
  { title: "安慰剂效应", fact: "坚信它有效，你的身体就会变好。", description: "如果患者坚信某种治疗有效，即使服用的是没有任何药理作用的糖丸，身体机能也可能产生真实的改善。" },
  { title: "选择过载", fact: "选择越多，幸福感越低。", description: "过多的选择会产生决策瘫痪。由于担心选错，人们在面对海量选项时往往会感到精疲力竭且对最终决定更不满意。" },
  { title: "自我服务偏差", fact: "成功是因为我牛，失败是因为运气不好。", description: "一种常见的心理调节机制。将成功归因于内在特质，将失败归因于外在因素，以此来保护自尊心。" },
  { title: "回光返照效应", fact: "高强度的专注后，往往是彻底的虚脱。", description: "大脑在长时间应对压力或挑战后，会进入一种“心理补偿期”，导致情绪低落或动力丧失。" },
  { title: "出丑效应", fact: "完美的人反而不如偶尔犯错的人受欢迎。", description: "一个能力很强的人如果偶尔表现出一点小缺点或犯点错，会拉近与他人的距离，显得更真实且更具亲和力。" },
  { title: "暗示效应", fact: "别人的一句话，真的能改变你的品味。", description: "我们的认知非常容易受到他人言语引导的影响。如果大家都说某种难喝的饮料好喝，你可能真的会觉得它有独特风味。" },
  { title: "后视偏差", fact: "“我就知道会这样！”——这可能也是错觉。", description: "事情发生后，人们倾向于夸大自己对该事件结果的预测能力。事实上，你当时可能同样迷茫。" },
  { title: "假性一致性效应", fact: "你以为大家的想法都跟你一样。", description: "我们倾向于认为自己的信念、习惯和偏好在人群中比实际情况更具普遍性，从而产生“共识”的假象。" },
  { title: "心理锚定", fact: "第一眼看到的价格，决定了你的消费观。", description: "我们在做决策时会过度依赖第一眼接收到的信息（锚点）。就像昂贵的原价衬托出折扣价的“划算”。" },
  { title: "暗示焦虑", fact: "越想睡觉，你反而越清醒。", description: "当你给大脑下达“不准思考”或“必须睡觉”的任务时，大脑会不断监控是否达到了目标，这种监控过程本身就是清醒的动机。" },
  { title: "霍桑效应", fact: "被人看着，工作效率真的会变高。", description: "当人们意识到自己正在被观察或关注时，会由于心理暗示而下意识地改变行为，表现得比平时更加积极。" },
  { title: "习得性无助", fact: "经历太多次失败后，你就不想再尝试了。", description: "反复经历不可控的挫折后，大脑会产生“努力也没用”的绝望感，即使机会再次来临也会选择放弃。" },
  { title: "对比效应", fact: "在丑小鸭中间，天鹅会显得更美。", description: "事物的特征会在与不同性质的事物对比时显得更加突出。这种感知偏差常被用于商业定价和人际社交。" },
  { title: "恐惧蔓延", fact: "未知的威胁，比明确的灾难更可怕。", description: "模糊性会放大焦虑感。一旦威胁变得具体且可理解，人的应对能力和心理韧性反而会显著增强。" },
  { title: "虚假记忆", fact: "你的童年回忆，可能有一半是编造的。", description: "大脑并不像录像机，它更像是一个故事编织者。我们会根据听到的故事和照片，重构出一段从未真实发生过的记忆。" },
  { title: "宜室宜家效应", fact: "装饰房间，真的能缓解压力。", description: "对物理空间的掌控感能直接转化为心理上的安全感。布置温馨的个人空间是最高效的心理自愈方式之一。" },
  { title: "镜像神经元", fact: "看别人流泪，你为什么也会难过？", description: "大脑中的特定神经元会模拟他人的动作和感受。这种生理基础让我们具备了同情心和共情能力。" },
  { title: "峰终定律", fact: "一段经历的好坏，取决于最高峰和结尾。", description: "人们对一段体验的记忆，主要受过程中的情感巅峰（最强感受）以及结尾时刻的影响，而与过程时长关系不大。" },
  { title: "自我实现预言", fact: "如果你觉得自己会失败，你可能真的会失败。", description: "由于你内心深处相信某个预测，你会下意识地做出符合该预测的行为，最终导致预测真的发生。" },
  { title: "知识退化", fact: "越是在行的领域，越容易犯低级错误。", description: "专家在处理基础问题时往往会自动导航，这种过度熟练导致了注意力的分配不足，从而产生疏忽。" },
  { title: "冷启动效应", fact: "最难的不是坚持，而是开始的那一刻。", description: "大脑在进入工作状态前需要克服巨大的“静态摩擦力”。一旦进入状态，多巴胺的反馈会让后续工作变得顺滑。" },
  { title: "罗森塔尔效应", fact: "老师的一个眼神，能决定学生的未来。", description: "权威者的期待和暗示会引导被期待者改变行为方式，以适应这种期待。这种力量在教育中尤为显著。" },
  { title: "沉浸式补偿", fact: "白天受的委屈，晚上想通过刷手机补回来。", description: "一种心理防御机制。当白天缺乏自主权时，人们会通过报复性熬夜等方式来重新夺回对生活的掌控感。" },
  { title: "多巴胺陷阱", fact: "让你快乐的不是得到，而是“快得到了”。", description: "多巴胺主要负责“期待”和“动机”。一旦欲望被满足，它的分泌就会迅速下降，这就是为什么到手后的失落感。" },
  { title: "情绪一致性记忆", fact: "难过的时候，你想起的全是倒霉事。", description: "我们提取记忆的能力受到当前情绪的影响。愉快时更容易想起好事，悲伤时大脑会自动检索所有悲惨的回忆。" },
  { title: "社交货币", fact: "分享冷知识，是为了让你显得更有趣。", description: "我们倾向于分享那些能让自己看起来更博学、更幽默的信息，这本质上是一种心理上的地位展示。" },
  { title: "舒适区效应", fact: "熟悉感就是大脑的止痛药。", description: "大脑天生厌恶不确定性。待在熟悉的环境中能降低皮质醇水平，虽然这可能阻碍成长，但却是最直接的放松方式。" }
];

const TriviaView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [shuffledDeck, setShuffledDeck] = useState<typeof triviaData>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const shuffleDeck = () => {
    setIsRefreshing(true);
    const deck = [...triviaData].sort(() => Math.random() - 0.5);
    setShuffledDeck(deck);
    setCurrentIndex(0);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Initialize once
  useEffect(() => {
    shuffleDeck();
  }, []);

  const current = shuffledDeck[currentIndex];

  if (shuffledDeck.length === 0) return null;

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      <header className="flex items-center justify-between mb-8 pr-2">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full glass flex items-center justify-center text-xl transition-all active:scale-90">←</button>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">心理百科</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">The hidden laws of mind</p>
          </div>
        </div>
        <button 
          onClick={shuffleDeck}
          className={`w-10 h-10 glass rounded-full flex items-center justify-center transition-all active:scale-90 ${isRefreshing ? 'rotate-180 opacity-50' : ''}`}
          title="重新打乱"
        >
          <span className="text-xl">🔄</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-2">
        {/* Main Card */}
        <div 
          key={currentIndex + (shuffledDeck[0]?.title || '')} 
          className={`w-full max-w-sm glass rounded-[3.5rem] p-10 border-amber-500/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden animate-in zoom-in-95 duration-500 min-h-[460px] flex flex-col justify-between ${isRefreshing ? 'opacity-50 scale-95 blur-sm' : ''}`}
        >
          {/* Background Decorative Element */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 p-8 text-7xl opacity-[0.02] select-none font-black italic">Insight</div>
          
          <div>
            <div className="flex items-center gap-2 mb-8">
               <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Psychology card</span>
            </div>
            <h3 className="text-3xl font-black text-white mb-6 tracking-tight leading-tight">{current.title}</h3>
            <p className="text-lg font-bold text-amber-200/90 leading-relaxed italic border-l-2 border-amber-500/30 pl-4">{current.fact}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-slate-400 text-sm leading-relaxed antialiased font-medium">{current.description}</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="w-full max-w-sm mt-12 space-y-6">
          {/* Progress Slider */}
          <div className="px-4">
            <div className="flex justify-between items-center mb-3">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">探索引导线</span>
               <span className="text-[10px] font-black text-amber-500/50 uppercase tracking-widest">{currentIndex + 1} / {shuffledDeck.length}</span>
            </div>
            <input 
              type="range"
              min="0"
              max={shuffledDeck.length - 1}
              value={currentIndex}
              onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-amber-500"
              style={{
                background: `linear-gradient(to right, #f59e0b ${(currentIndex / (shuffledDeck.length - 1)) * 100}%, rgba(255,255,255,0.05) 0%)`
              }}
            />
          </div>

          {/* Quick Step Buttons */}
          <div className="flex gap-4">
             <button 
               onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
               className="flex-1 py-4 glass rounded-3xl text-slate-400 font-bold active:scale-95 transition-all flex items-center justify-center gap-2"
             >
               <span className="text-lg">←</span> 上一项
             </button>
             <button 
               onClick={() => setCurrentIndex(prev => Math.min(shuffledDeck.length - 1, prev + 1))}
               className="flex-[2] py-4 bg-amber-500 text-slate-950 font-black rounded-3xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
             >
               下一项 <span className="text-lg">→</span>
             </button>
          </div>
        </div>
      </div>
      
      <div className="h-6"></div>

      <style dangerouslySetInnerHTML={{ __html: `
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          cursor: pointer;
          border: 2px solid #f59e0b;
        }
        input[type=range]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #f59e0b;
        }
      `}} />
    </div>
  );
};

export default TriviaView;
