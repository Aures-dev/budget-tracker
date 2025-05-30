'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react'; // For loading spinner

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [pageLoading, setPageLoading] = useState(true);

  // Simulate page loading
  useState(() => {
    setTimeout(() => setPageLoading(false), 500);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Forcer un événement de storage pour mettre à jour le contexte
      window.dispatchEvent(new Event('storage'));

      toast({
        title: 'Connexion réussie',
        description: 'Vous allez être redirigé vers le tableau de bord',
      });

      // Rediriger vers le tableau de bord
      router.push('/');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen py-10 bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-purple-900">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen py-10 bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-purple-900"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Connexion
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Accédez à votre compte pour gérer vos finances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemple@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  aria-label="Adresse email"
                />
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  aria-label="Mot de passe"
                />
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                  aria-label={isLoading ? 'Connexion en cours' : 'Se connecter'}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </span>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-sm"
            >
              <p className="text-gray-600 dark:text-gray-400">
                Pas encore de compte ?{' '}
                <Link
                  href="/register"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:underline transition-colors duration-200"
                >
                  S'inscrire
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}