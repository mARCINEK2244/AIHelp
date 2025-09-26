import React, { useState, useEffect } from 'react';
import type { AIResponse, FollowupQuestion } from '../types';
import { AlertTriangleIcon, ClipboardListIcon, HeartPulseIcon, HelpCircleIcon, LightbulbIcon, SparklesIcon, TrendingUpIcon, ZapIcon } from './icons';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiResponse: AIResponse | null;
  isLoading: boolean;
  onFollowupSubmit: (answers: { [key: string]: string | string[] }) => void;
}

type Answers = { [key: string]: string | string[] };

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }> = ({ icon, title, children, className = '' }) => (
  <div className={`bg-slate-700/50 p-4 rounded-lg ${className}`}>
    <div className="flex items-center gap-3 mb-3">
      <div className="flex-shrink-0 w-8 h-8 bg-slate-800/70 text-teal-300 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
    </div>
    <div className="pl-11 space-y-2 text-slate-300">
        {children}
    </div>
  </div>
);


const AlarmModal: React.FC<AlarmModalProps> = ({ isOpen, onClose, aiResponse, isLoading, onFollowupSubmit }) => {
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    // Reset answers when a new response is loaded
    if (aiResponse) {
      setAnswers({});
    }
  }, [aiResponse]);

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };
  
  const handleMultiAnswerChange = (id: string, value: string) => {
    setAnswers(prev => {
      const existing = (prev[id] as string[] | undefined) || [];
      const newSet = new Set(existing);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return { ...prev, [id]: Array.from(newSet) };
    });
  };

  const handleClose = () => {
    if (aiResponse && (aiResponse.followup_questions?.length ?? 0) > 0) {
      onFollowupSubmit(answers);
    }
    onClose();
  };

  if (!isOpen) return null;

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center space-y-3 text-slate-400 p-8">
        <div className="w-12 h-12 border-4 border-slate-600 border-t-teal-400 rounded-full animate-spin"></div>
        <p className="text-lg">Generuję dla Ciebie spersonalizowane wsparcie...</p>
        <p className="text-sm text-slate-500">Analizuję Twoje postępy, aby dać Ci najlepsze porady.</p>
    </div>
  );

  const renderCrisis = (response: AIResponse) => (
      <div className="p-8">
        <div className="text-center">
            <AlertTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-red-300">Twoje bezpieczeństwo jest najważniejsze</h2>
            <p className="text-slate-300 mt-4 text-lg">{response.crisis.message}</p>
        </div>
        <div className="mt-8 space-y-4">
            {response.crisis.hotlines.map((line, index) => (
                <div key={index} className="bg-red-500/10 p-4 rounded-lg border border-red-500/30 text-center">
                    <p className="text-red-300 font-semibold text-lg">{line}</p>
                </div>
            ))}
        </div>
        <div className="mt-6 text-slate-400 text-sm">
            <p><strong>Pamiętaj:</strong> sięgnięcie po pomoc to oznaka siły, nie słabości. Nie jesteś sam/a.</p>
        </div>
      </div>
  );

  const renderFollowupQuestions = (questions: FollowupQuestion[]) => {
    if (!questions || questions.length === 0) return null;

    return (
      <Section icon={<HelpCircleIcon className="w-5 h-5"/>} title="Powiedz nam więcej">
          <div className="space-y-4">
            {questions.map(q => (
              <div key={q.id}>
                <p className="font-semibold text-slate-300 mb-2">{q.question}</p>
                {q.type === 'text' && (
                  <textarea
                    value={(answers[q.id] as string) || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full bg-slate-800 p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-teal-400 outline-none"
                    rows={2}
                  />
                )}
                {q.type === 'single' && q.options && (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => handleAnswerChange(q.id, opt)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${answers[q.id] === opt ? 'bg-teal-600 text-white' : 'bg-slate-600 hover:bg-slate-500'}`}
                      >
                          {opt}
                      </button>
                    ))}
                  </div>
                )}
                 {q.type === 'multi' && q.options && (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => (
                       <button 
                        key={opt}
                        onClick={() => handleMultiAnswerChange(q.id, opt)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${((answers[q.id] as string[]) || []).includes(opt) ? 'bg-teal-600 text-white' : 'bg-slate-600 hover:bg-slate-500'}`}
                      >
                          {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
      </Section>
    );
  }

  const renderContent = (response: AIResponse) => (
    <>
      <div className="text-center px-4">
        <HeartPulseIcon className="w-16 h-16 text-teal-400 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-sky-400">
          Jesteśmy tu, by Ci pomóc
        </h2>
        <p className="text-slate-300 mt-2">{response.summary}</p>
      </div>
      <div className="mt-8 space-y-4 px-2">
        {response.trend_warning?.is_flagged && (
           <Section icon={<TrendingUpIcon className="w-5 h-5"/>} title="Wykryto trend" className="bg-amber-500/10 border border-amber-500/30">
              <p className="text-amber-200">{response.trend_warning.message}</p>
              <p><span className="font-semibold text-sky-300">Sugestia:</span> {response.trend_warning.suggested_adjustment}</p>
          </Section>
        )}
        <Section icon={<LightbulbIcon className="w-5 h-5"/>} title="Wgląd w sytuację">
            <p>{response.insight}</p>
        </Section>
        <Section icon={<ClipboardListIcon className="w-5 h-5"/>} title="Twój mikro-plan">
          {response.plan.map((item, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-slate-600/50 pb-3 last:border-b-0 last:pb-0">
              <span className="font-bold text-teal-400 mt-0.5">{i + 1}.</span>
              <div>
                <p>{item.step}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Czas: {item.duration}</p>
                <p className="text-xs text-sky-300/80 mt-1"><i>Dlaczego? {item.why}</i></p>
              </div>
            </div>
          ))}
        </Section>
        <Section icon={<ZapIcon className="w-5 h-5"/>} title="Strategie na wyzwalacze">
          {response.if_trigger_then_strategy.map((item, i) => (
            <div key={i} className="text-sm">
              <p><span className="font-semibold text-teal-400">Jeśli:</span> {item.trigger}</p>
              <p><span className="font-semibold text-sky-400">Wtedy:</span> {item.strategy}</p>
            </div>
          ))}
        </Section>
        <Section icon={<SparklesIcon className="w-5 h-5"/>} title="Motywacja dla Ciebie">
          <p className="italic">"{response.motivation}"</p>
        </Section>
         <Section icon={<HelpCircleIcon className="w-5 h-5"/>} title="Pytanie do refleksji">
          <p>{response.reflect_question}</p>
        </Section>
        {renderFollowupQuestions(response.followup_questions)}
      </div>
       <div className="text-xs text-slate-500 text-center mt-6 px-4">
            <p>To wsparcie informacyjne, nie zastępuje porady specjalisty.</p>
        </div>
    </>
  );

  return (
    <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={handleClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-teal-500/20 transform transition-all animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="py-8">
            {isLoading || !aiResponse ? renderLoading() : (aiResponse.crisis.is_flagged ? renderCrisis(aiResponse) : renderContent(aiResponse))}
        </div>
        
        <div className="sticky bottom-0 bg-slate-800/80 backdrop-blur-sm p-4 text-center border-t border-slate-700/50">
            <button
                onClick={handleClose}
                className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500/50"
            >
                Zamknij i zapisz odpowiedzi
            </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;