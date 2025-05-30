'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { AuthUser } from '@/types/auth';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-purple-600" />
          <Link href="/" className="text-lg font-semibold">
            Budget Tracker
          </Link>
        </div>
        
        <nav className="flex items-center gap-2 md:gap-5">
          {user && (
            <>
              <Link 
                href="/" 
                className="text-sm font-medium transition-colors hover:text-purple-600"
              >
                Dashboard
              </Link>
              <Link 
                href="/transactions" 
                className="text-sm font-medium transition-colors hover:text-purple-600"
              >
                Transactions
              </Link>
            </>
          )}
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="text-sm">
                    {user.username}
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-xs h-8 px-3 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950"
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}