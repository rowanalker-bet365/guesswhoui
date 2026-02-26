'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../atoms/Button';

interface HeaderProps {
  isLoggedIn: boolean;
  teamName?: string;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, teamName, onSignOut }) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <header className="flex items-center justify-between border-b bg-brand p-4 text-white">
      <Link href="/" className="text-2xl font-bold text-white">
        Guess Who?
      </Link>
      <nav>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4 text-white">
            <Button variant="ghost" onClick={() => setShowHowToPlay(true)}>
              How to Play
            </Button>
            <Link href="/team">
              <Button variant="ghost">{teamName || 'Team Page'}</Button>
            </Link>
            <Button onClick={onSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => setShowHowToPlay(true)}>
              How to Play
            </Button>
            <div className="ml-4 flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export { Header };