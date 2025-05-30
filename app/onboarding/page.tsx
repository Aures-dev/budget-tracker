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
import { UserPreferences } from '@/types/auth';

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
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    currency: 'USD',
    language: 'fr',
    theme: 'light',
    incomeSources: [],
    defaultCategories: []
  });
  const [newIncomeSource, setNewIncomeSource] = useState({
    name: '',
    isRecurring: false,
    frequency: 'monthly'
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  const handleAddIncomeSource = () => {
    if (!newIncomeSource.name) return;

    setPreferences(prev => ({
      ...prev,
      incomeSources: [
        ...(prev.incomeSources || []),
        newIncomeSource
      ]
    }));

    setNewIncomeSource({
      name: '',
      isRecurring: false,
      frequency: 'monthly'
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          preferences
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

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Configuration initiale</CardTitle>
          <CardDescription>
            Configurez vos préférences pour personnaliser votre expérience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
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
              </div>

              <div className="space-y-4">
                <Label>Sources de revenus</Label>
                <div className="space-y-4">
                  {preferences.incomeSources?.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{source.name}</p>
                        <p className="text-sm text-muted-foreground">
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
                            incomeSources: prev.incomeSources?.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}

                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="sourceName">Nom de la source</Label>
                      <Input
                        id="sourceName"
                        value={newIncomeSource.name}
                        onChange={(e) => setNewIncomeSource(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                        placeholder="Ex: Salaire, Freelance, etc."
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="recurring"
                        checked={newIncomeSource.isRecurring}
                        onCheckedChange={(checked) => setNewIncomeSource(prev => ({
                          ...prev,
                          isRecurring: checked
                        }))}
                      />
                      <Label htmlFor="recurring">Revenu récurrent</Label>
                    </div>

                    {newIncomeSource.isRecurring && (
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Fréquence</Label>
                        <Select
                          value={newIncomeSource.frequency}
                          onValueChange={(value) => setNewIncomeSource(prev => ({
                            ...prev,
                            frequency: value as 'weekly' | 'monthly' | 'yearly'
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                            <SelectItem value="monthly">Mensuel</SelectItem>
                            <SelectItem value="yearly">Annuel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddIncomeSource}
                      className="w-full"
                    >
                      Ajouter cette source
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : 'Terminer la configuration'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 