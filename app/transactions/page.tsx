'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/types/auth';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function TransactionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    setTimeout(() => setIsLoading(false), 500); // Simulate loading
  }, [router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen py-10 bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-purple-900">
        <div className="w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8 mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-purple-900 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent"
          aria-label="Transactions"
        >
          Transactions
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg p-6">
                <TransactionForm />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <TransactionsTable />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}