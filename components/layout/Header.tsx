'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet } from 'lucide-react';
import { useBudget } from '@/contexts/BudgetContext';

export function Header() {
  const { user, login, logout } = useBudget();
  const [username, setUsername] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
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
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden md:inline-block">
                  {user.username}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-xs h-8 px-3 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white h-8"
                  >
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Login to Budget Tracker</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4 pt-4">
                    <Input
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Continue
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}