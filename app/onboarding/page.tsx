'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { UserPreferences, IncomeSource } from '@/types/auth';

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'XOF', label: 'XOF (CFA)' },
];

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    currency: 'USD',
    language: 'fr',
    theme: 'light',
    incomeSources: [],
    defaultCategories: [],
  });
  const [newIncomeSource, setNewIncomeSource] = useState<Omit<IncomeSource, '_id'>>({
    name: '',
    isRecurring: false,
    frequency: 'monthly',
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
    setTimeout(() => setPageLoading(false), 500); // Simulate page loading
  }, [router]);

  const handleAddIncomeSource = () => {
    if (!newIncomeSource.name) return;

    setPreferences(prev => ({
      ...prev,
      incomeSources: [
        ...(prev.incomeSources || []),
        {
          name: newIncomeSource.name,
          isRecurring: newIncomeSource.isRecurring,
          frequency: newIncomeSource.frequency,
        },
      ],
    }));

    setNewIncomeSource({
      name: '',
      isRecurring: false,
      frequency: 'monthly',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      toast({
        title: 'Configuration terminée',
        description: 'Vos préférences ont été enregistrées avec succès',
      });

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

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen py-10 bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-purple-900">
        <div className="w-full max-w-2xl space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <Skeleton className="h-96 w-full rounded-lg" />
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
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Configuration initiale
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Personnalisez votre expérience pour commencer à gérer vos finances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-gray-700 dark:text-gray-200">
                      Devise
                    </Label>
                    <Select
                      value={preferences.currency}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500">
                        <SelectValue placeholder="Sélectionnez une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map(currency => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-gray-700 dark:text-gray-200">
                      Langue
                    </Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500">
                        <SelectValue placeholder="Sélectionnez une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map(language => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <Label className="text-gray-700 dark:text-gray-200">Sources de revenus</Label>
                  <div className="space-y-4">
                    {preferences.incomeSources?.map((source, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 border border-purple-200 dark:border-purple-800 rounded-lg shadow-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{source.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {source.isRecurring ? `Récurrent (${source.frequency})` : 'Non récurrent'}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setPreferences(prev => ({
                              ...prev,
                              incomeSources: prev.incomeSources?.filter((_, i) => i !== index),
                            }));
                          }}
                          aria-label={`Supprimer ${source.name}`}
                        >
                          Supprimer
                        </Button>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-4 p-4 bg-white/50 dark:bg-gray-900/50 border border-purple-200 dark:border-purple-800 rounded-lg"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="sourceName" className="text-gray-700 dark:text-gray-200">
                          Nom de la source
                        </Label>
                        <Input
                          id="sourceName"
                          value={newIncomeSource.name}
                          onChange={(e) =>
                            setNewIncomeSource(prev => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Ex: Salaire, Freelance, etc."
                          className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500"
                          aria-label="Nom de la source de revenu"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="recurring"
                          checked={newIncomeSource.isRecurring}
                          onCheckedChange={(checked) =>
                            setNewIncomeSource(prev => ({
                              ...prev,
                              isRecurring: checked,
                            }))
                          }
                          aria-label="Revenu récurrent"
                        />
                        <Label htmlFor="recurring" className="text-gray-700 dark:text-gray-200">
                          Revenu récurrent
                        </Label>
                      </div>
                      {newIncomeSource.isRecurring && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="frequency" className="text-gray-700 dark:text-gray-200">
                            Fréquence
                          </Label>
                          <Select
                            value={newIncomeSource.frequency}
                            onValueChange={(value) =>
                              setNewIncomeSource(prev => ({
                                ...prev,
                                frequency: value as 'weekly' | 'monthly' | 'yearly',
                              }))
                            }
                          >
                            <SelectTrigger className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Hebdomadaire</SelectItem>
                              <SelectItem value="monthly">Mensuel</SelectItem>
                              <SelectItem value="yearly">Annuel</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      )}
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleAddIncomeSource}
                        className="w-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-all duration-300"
                        aria-label="Ajouter cette source de revenu"
                      >
                        Ajouter cette source
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                  aria-label={isLoading ? 'Enregistrement en cours' : 'Terminer la configuration'}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </span>
                  ) : (
                    'Terminer la configuration'
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}