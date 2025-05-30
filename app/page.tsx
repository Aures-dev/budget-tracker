'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AuthUser } from '@/types/auth';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { ExpensesChart } from '@/components/dashboard/ExpensesChart';
import { TransactionForm } from '@/components/transactions/TransactionForm';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; // ou un composant de chargement
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
        <div className="container max-w-6xl mx-auto px-4 py-16 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Gérez vos finances en toute simplicité
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Prenez le contrôle de votre argent avec notre outil de suivi budgétaire intuitif et sécurisé.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => router.push('/register')}
                >
                  Commencer gratuitement
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/login')}
                >
                  Se connecter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Suivi en temps réel</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Visualisez vos dépenses et revenus instantanément
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Analyses détaillées</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Graphiques et rapports personnalisés
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Multi-devises</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Gérez votre argent dans différentes devises
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <Image
              src="/expense-tracking.png"
              alt="Budget Tracker Dashboard"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">
          Bonjour, <span className="text-purple-600">{user.username}</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <BalanceCard />
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <ExpensesChart />
            <RecentTransactions />
          </div>
          
          <div className="md:col-span-1">
            <TransactionForm />
          </div>
        </div>
      </div>
    </div>
  );
}