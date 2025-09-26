import React, { useState } from 'react';
import type { UserInfo } from '../types';
import { HeartPulseIcon, ShieldCheckIcon } from './icons';

interface UserInfoFormProps {
  onSubmit: (userInfo: UserInfo) => void;
  onBack: () => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit, onBack }) => {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<UserInfo['gender']>('prefer_not_to_say');
  const [abstinenceStart, setAbstinenceStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [allowAnonymousCollection, setAllowAnonymousCollection] = useState<boolean>(true);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [triggerInput, setTriggerInput] = useState('');
  const [error, setError] = useState<string>('');

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && triggerInput.trim()) {
      e.preventDefault();
      const newTrigger = triggerInput.trim().replace(/,$/, '');
      if (newTrigger && !triggers.includes(newTrigger)) {
        setTriggers(prev => [...prev, newTrigger]);
      }
      setTriggerInput('');
    }
  };

  const removeTrigger = (triggerToRemove: string) => {
    setTriggers(prev => prev.filter(t => t !== triggerToRemove));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 12 || ageNum > 100) {
      setError('Proszę podać prawidłowy wiek (między 12 a 100 lat).');
      return;
    }
    setError('');
    onSubmit({
      age: ageNum,
      gender,
      abstinenceStart,
      allowAnonymousCollection,
      triggers,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 animate-fade-in">
       <div className="mb-8">
        <HeartPulseIcon className="w-16 h-16 text-teal-400 mx-auto" />
        <h1 className="text-3xl md:text-4xl font-bold mt-4 text-slate-100">
          Opowiedz nam o sobie
        </h1>
        <p className="text-slate-400 mt-2 max-w-md mx-auto">Te informacje pomogą nam dostosować wsparcie do Twoich potrzeb. Dane są przechowywane tylko na Twoim urządzeniu.</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 bg-slate-800 p-8 rounded-lg border border-slate-700">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-slate-300 text-left mb-2">Wiek</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
            placeholder="Np. 25"
            required
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-slate-300 text-left mb-2">Płeć</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as UserInfo['gender'])}
            className="w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none appearance-none"
          >
            <option value="female">Kobieta</option>
            <option value="male">Mężczyzna</option>
            <option value="other">Inna</option>
            <option value="prefer_not_to_say">Wolę nie podawać</option>
          </select>
        </div>
        <div>
          <label htmlFor="abstinenceStart" className="block text-sm font-medium text-slate-300 text-left mb-2">Data rozpoczęcia abstynencji</label>
          <input
            type="date"
            id="abstinenceStart"
            value={abstinenceStart}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setAbstinenceStart(e.target.value)}
            className="w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-300 text-left mb-2">Twoje typowe wyzwalacze (opcjonalnie)</label>
            <p className="text-xs text-slate-400 text-left mb-3">Wpisz co zwykle wywołuje głód (np. 'Kawa', 'Stres') i naciśnij Enter. Pomoże to AI lepiej Cię zrozumieć.</p>
            <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-700 rounded-lg border border-slate-600">
                {triggers.map(trigger => (
                    <span key={trigger} className="flex items-center gap-2 bg-sky-500/20 text-sky-300 text-sm font-medium px-3 py-1 rounded-full">
                        {trigger}
                        <button onClick={() => removeTrigger(trigger)} className="text-sky-200 hover:text-white" type="button">&times;</button>
                    </span>
                ))}
                <input
                  type="text"
                  value={triggerInput}
                  onChange={(e) => setTriggerInput(e.target.value)}
                  onKeyDown={handleTriggerKeyDown}
                  placeholder={triggers.length === 0 ? "Wpisz wyzwalacz..." : "Dodaj kolejny..."}
                  className="flex-1 bg-transparent p-1 focus:outline-none text-white min-w-[120px]"
                />
            </div>
        </div>

        <div className="text-left bg-slate-900/50 p-4 rounded-lg border border-slate-600">
          <div className="flex items-start gap-3">
              <ShieldCheckIcon className="w-6 h-6 text-sky-400 mt-1 flex-shrink-0" />
              <div>
                  <h4 className="font-semibold text-slate-200">Pomóż nam ulepszać AI</h4>
                  <p className="text-xs text-slate-400 mt-1">Zgadzam się na anonimowe udostępnianie danych o moim głodzie, otrzymanych poradach i ocenie ich skuteczności. Pomoże to w trenowaniu lepszych modeli AI dla wszystkich użytkowników.</p>
                  <p className="text-xs text-slate-500 mt-2"><strong>Ważne:</strong> Twoje dane osobowe (wiek, płeć) nigdy nie są udostępniane.</p>
              </div>
          </div>
          <label className="flex items-center mt-3 cursor-pointer">
              <input
                  type="checkbox"
                  checked={allowAnonymousCollection}
                  onChange={(e) => setAllowAnonymousCollection(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 bg-slate-600"
              />
              <span className="ml-2 text-sm text-slate-300">Tak, chcę pomagać w rozwoju aplikacji</span>
          </label>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
           <button
            type="button"
            onClick={onBack}
            className="w-full py-3 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold text-white transition-colors text-lg"
          >
            Wróć
          </button>
          <button type="submit" className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 rounded-lg font-semibold text-white transition-colors text-lg">
            Rozpocznij
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInfoForm;