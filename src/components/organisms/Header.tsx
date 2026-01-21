'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../atoms/Button';

interface HeaderProps {
  isLoggedIn: boolean;
  teamName?: string;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, teamName, onSignOut }) => {
  return (
    <header className="flex items-center justify-between border-b bg-white p-4">
      <Link href="/" className="text-2xl font-bold text-primary">
        Guess Who?
      </Link>
      <nav>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
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
    </header>
  );
};

export { Header };