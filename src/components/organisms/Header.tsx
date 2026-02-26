'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../atoms/Button';
import { HowToPlayModal } from './HowToPlayModal';

interface HeaderProps {
  isLoggedIn: boolean;
  teamName?: string;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, teamName, onSignOut }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b bg-brand p-4 text-white">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-white">
          Guess Who: Identity Under Fire
        </Link>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm font-medium text-white underline-offset-2 hover:underline focus:outline-none"
        >
          How to Play
        </button>
      </div>
      <nav>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4 text-white">
            <Link href="/team">
              <Button variant="ghost">{teamName || 'Team Page'}</Button>
            </Link>
            <Button onClick={onSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </nav>
      <HowToPlayModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export { Header };