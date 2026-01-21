'use client';

import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

interface LoginFormProps {
  onLogin: (teamName: string, password: string) => void;
  error?: string;
  disabled?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error, disabled = false }) => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(teamName, password);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <label htmlFor="teamName">Team Name</label>
        <Input
          id="teamName"
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password">Password</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={disabled}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={disabled}>
        {disabled ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export { LoginForm };