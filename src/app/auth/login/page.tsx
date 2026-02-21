'use client';

import React from 'react';
import { LoginForm } from '@/components/organisms/LoginForm';
import { useRouter } from 'next/navigation';
import { useGameStoreApi } from '@/contexts/GameContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useGameStoreApi().getState();
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (teamName: string, password: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { token, team, sessionId } = await response.json();
      login(team, token, sessionId);
      router.push('/team');
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-black shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold">Team Login</h1>
        <LoginForm onLogin={handleLogin} error={error} disabled={isLoading} />
      </div>
    </div>
  );
}