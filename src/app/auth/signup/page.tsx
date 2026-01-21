'use client';

import React from 'react';
import { SignupForm } from '@/components/organisms/SignupForm';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignup = async (teamName: string, password: string) => {
    setIsLoading(true);
    setError('');
    try {
      await api.signup(teamName, password);
      router.push('/auth/login?status=signup_success');
    } catch (e: any) {
      setError(e.info?.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold">Create a Team</h1>
        <SignupForm onSignup={handleSignup} error={error} disabled={isLoading} />
      </div>
    </div>
  );
}