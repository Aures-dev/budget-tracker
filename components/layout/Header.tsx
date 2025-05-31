'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Menu } from 'lucide-react';
import { AuthUser } from '@/types/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdate', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdate', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    router.push('/login');
  };

  const getFallbackInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-purple-200/50 dark:border-purple-800/50 ml-4"
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <Wallet className="h-6 w-6 text-purple-600" aria-hidden="true" />
          <Link href="/" className="text-lg font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
            Budget Tracker
          </Link>
        </motion.div>

        <nav className="flex items-center gap-4 md:gap-6">
          <button
            className="md:hidden text-purple-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Ouvrir le menu mobile"
          >
            <Menu className="h-6 w-6" />
          </button>

          <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white/90 dark:bg-gray-900/90 md:bg-transparent dark:md:bg-transparent p-4 md:p-0 gap-4 items-center shadow-md md:shadow-none`}
          >
            {user && (
              <>
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </Link>
                <Link
                  href="/transactions"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 relative group"
                >
                  Transactions
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </Link>
              </>
            )}

            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <ThemeToggle />
              </motion.div>

              {user ? (
                <div className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <Link href="/profile" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback className="bg-purple-100 text-purple-700 text-sm">
                          {getFallbackInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                        aria-label={`Profil de ${user.username}`}
                      >
                        {user.username}
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="text-xs h-8 px-3 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-300"
                      aria-label="Se déconnecter"
                    >
                      Déconnexion
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                        aria-label="Connexion"
                      >
                        Connexion
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <Link href="/register">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white h-8 px-3 transition-all duration-300"
                        aria-label="S'inscrire"
                      >
                        S'inscrire
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
}