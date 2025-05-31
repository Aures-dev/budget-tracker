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
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Input } from '@/components/ui/input';

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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setFormData({
      username: parsedUser.username,
      email: parsedUser.email
    });
    setIsLoading(false);
  }, [router]);

  const handleAvatarChange = async (file: File) => {
    if (!user) return;

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userId', user.id);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const { avatarUrl } = await response.json();
        const updatedUser = {
          ...user,
          avatarUrl
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userUpdate'));
        
        toast({
          title: "Photo de profil mise à jour",
          description: "Votre photo de profil a été mise à jour avec succès."
        });
      } else {
        throw new Error('Failed to update avatar');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la photo de profil.",
        variant: "destructive"
      });
    }
  };

  const handleUserInfoUpdate = async () => {
    if (!user) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          username: formData.username,
          email: formData.email
        })
      });

      if (response.ok) {
        const updatedUser = {
          ...user,
          username: formData.username,
          email: formData.email
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été mises à jour avec succès."
        });
      } else {
        throw new Error('Failed to update user info');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos informations.",
        variant: "destructive"
      });
    }
  };

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
          <CardContent className="space-y-6">
            <AvatarUpload
              currentAvatarUrl={user.avatarUrl}
              username={user.username}
              onAvatarChange={handleAvatarChange}
            />

            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="border-purple-300 dark:border-purple-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="border-purple-300 dark:border-purple-700"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleUserInfoUpdate}>
                      Enregistrer
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setFormData({ username: user.username, email: user.email });
                    }}>
                      Annuler
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Nom d'utilisateur</Label>
                    <p className="text-lg font-medium">{user.username}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="mt-4">
                    Modifier
                  </Button>
                </>
              )}
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
                    if (user) {
                      updatePreferences({ theme: 'light' });
                    }
                  }}
                >
                  Clair
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => {
                    setTheme('dark');
                    if (user) {
                      updatePreferences({ theme: 'dark' });
                    }
                  }}
                >
                  Sombre
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => {
                    setTheme('system');
                    if (user) {
                      updatePreferences({ theme: undefined });
                    }
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