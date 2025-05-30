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
import { motion, AnimatePresence } from 'framer-motion'; // For animations
import { Skeleton } from '@/components/ui/skeleton'; // For loading states

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setTimeout(() => setIsLoading(false), 500); // Simulate loading
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
        <div className="container max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-purple-900"
      >
        <div className="container max-w-7xl mx-auto px-4 py-16 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent pb-1">
                Gérez vos finances avec élégance
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
                Simplifiez la gestion de votre budget avec notre outil intuitif, sécurisé et moderne.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                onClick={() => router.push('/register')}
                aria-label="Commencer gratuitement"
              >
                Commencer gratuitement
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-all duration-300"
                onClick={() => router.push('/login')}
                aria-label="Se connecter"
              >
                Se connecter
              </Button>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8"
            >
              {[
                {
                  title: 'Suivi en temps réel',
                  desc: 'Visualisez vos dépenses et revenus instantanément',
                },
                {
                  title: 'Analyses détaillées',
                  desc: 'Graphiques et rapports personnalisés',
                },
                {
                  title: 'Multi-devises',
                  desc: 'Gérez votre argent dans différentes devises',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="space-y-2 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex-1 relative"
          >
            <Image
              src="/expense-tracking.png"
              alt="Budget Tracker Dashboard"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl border border-purple-200 dark:border-purple-800"
              priority
            />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-4 mb-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-center md:text-left">
          Bonjour,{' '}
          <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
            {user.username}
          </span>
        </h1>
      </header>

      <div className="space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-3">
            <BalanceCard />
          </div>

          <div className="md:col-span-2 space-y-6">
            <ExpensesChart />
            <RecentTransactions />
          </div>

          <div className="md:col-span-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
            >
              <TransactionForm />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}