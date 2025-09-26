import React, { useState } from 'react';
import { HeartPulseIcon } from './icons';

interface AuthProps {
  onLogin: (email: string, password: string) => Promise<any>;
  onSignup: (email: string, password: string) => Promise<any>;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignup }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await onLogin(email, password);
      } else {
        await onSignup(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 animate-fade-in">
      <div className="mb-8">
        <HeartPulseIcon className="w-20 h-20 text-teal-400 mx-auto" />
        <h1 className="text-4xl md:text-5xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-sky-400">
          Asystent Wsparcia
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Zaloguj się lub utwórz konto, aby zapisać swoje postępy.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 bg-slate-800 p-8 rounded-lg border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-100">{isLoginMode ? 'Logowanie' : 'Rejestracja'}</h2>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 text-left mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
            placeholder="twoj@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 text-left mb-2">Hasło</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-700 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-md">{error}</p>}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 rounded-lg font-semibold text-white transition-colors text-lg disabled:bg-slate-600 disabled:cursor-wait"
        >
          {isLoading ? 'Przetwarzanie...' : (isLoginMode ? 'Zaloguj się' : 'Utwórz konto')}
        </button>

        <p className="text-sm text-slate-400">
          {isLoginMode ? 'Nie masz jeszcze konta?' : 'Masz już konto?'}
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
            className="font-semibold text-teal-400 hover:text-teal-300 ml-2"
          >
            {isLoginMode ? 'Zarejestruj się' : 'Zaloguj się'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Auth;
