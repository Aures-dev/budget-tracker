'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, UserPreferences } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const CURRENCIES = [
  { value: 'USD', label: 'USD - Dollar américain' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'XOF', label: 'XOF - Franc CFA' },
  { value: 'GBP', label: 'GBP - Livre sterling' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, [router]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          userId: user.id,
          preferences: {
            ...user.preferences,
            ...updates,
            _id: user.preferences._id
          }
        })
      });

      if (response.ok) {
        const updatedUser = {
          ...user,
          preferences: {
            ...user.preferences,
            ...updates
          }
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast({
          title: "Préférences mises à jour",
          description: "Vos préférences ont été enregistrées avec succès."
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour les préférences.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive"
      });
    }
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Profil</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nom d'utilisateur</Label>
              <p className="text-lg font-medium">{user.username}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Devise</Label>
              <Select
                value={user.preferences.currency}
                onValueChange={(value) => updatePreferences({ currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une devise" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Thème</Label>
              <div className="flex gap-4">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => {
                    setTheme('light');
                    updatePreferences({ theme: 'light' });
                  }}
                >
                  Clair
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => {
                    setTheme('dark');
                    updatePreferences({ theme: 'dark' });
                  }}
                >
                  Sombre
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => {
                    setTheme('system');
                    updatePreferences({ theme: undefined });
                  }}
                >
                  Système
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 