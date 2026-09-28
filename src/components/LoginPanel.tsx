import React, { useState } from 'react';
import { Logo } from './Logo';

interface LoginPanelProps {
  onLogin: (username: string, section: string) => void;
}

export function LoginPanel({ onLogin }: LoginPanelProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple demo authentication mapping
    const userMap: Record<string, string> = {
      'student_bme': 'II-BME',
      'student_ece_a': 'II-ECE-DS-A',
      'student_ece_b': 'II-ECE-DS-B',
      'student_bme_3': 'III-BME',
      'student_ece_1': 'I-ECE-A',
    };

    const section = userMap[username.toLowerCase()];
    
    if (section && password === 'password123') {
      onLogin(username, section);
    } else {
      setError('Invalid username or password. Try student_bme / password123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0c]">
      <div className="surface-card p-8 w-full max-w-md animate-in">
        <div className="flex justify-center mb-8">
          <Logo size={40} showWordmark={true} />
        </div>
        
        <h2 className="text-xl font-bold text-white text-center mb-2">Welcome Back</h2>
        <p className="text-white/40 text-sm text-center mb-8">Sign in to your AttendGuard dashboard</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label-subtle block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              className="input-field w-full"
              placeholder="e.g. student_bme"
              required
            />
          </div>
          
          <div>
            <label className="label-subtle block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="input-field w-full"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button type="submit" className="btn-primary w-full mt-4">
            Sign In
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-white/[0.02] border border-white/[0.05] rounded-lg">
          <p className="text-xs text-white/50 font-medium mb-2">Demo Accounts (Password: password123)</p>
          <ul className="text-xs text-white/40 space-y-1 font-mono">
            <li>• student_bme (II-BME)</li>
            <li>• student_ece_a (II-ECE-DS A)</li>
            <li>• student_ece_b (II-ECE-DS B)</li>
            <li>• student_bme_3 (III-BME)</li>
            <li>• student_ece_1 (I-ECE-A)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
