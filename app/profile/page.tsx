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
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const CURRENCIES = [
  { value: 'USD', label: 'USD - Dollar Américain' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'XOF', label: 'XOF - Franc CFA' },
  { value: 'GBP', label: 'GBP - Livre Britannique' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
      username: parsedUser.username || '',
      email: parsedUser.email || '',
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
      setIsSubmitting(true);
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const { avatarUrl } = await response.json();
        const updatedUser = { ...user, avatarUrl };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('storage'));

        toast({
          title: 'Succès',
          description: 'Votre photo de profil a été mise à jour.',
        });
      } else {
        throw new Error('Échec de la mise à jour de l\'avatar');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la photo de profil.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserInfoUpdate = async () => {
    if (!user) return;

    const token = localStorage.getItem('token');
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          username: formData.username,
          email: formData.email,
        }),
      });

      if (response.ok) {
        const updatedUser = {
          ...user,
          username: formData.username,
          email: formData.email,
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);

        toast({
          title: 'Succès',
          description: 'Vos informations ont été mises à jour.',
        });
      } else {
        throw new Error('Échec de la mise à jour des informations');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour vos informations.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    const token = localStorage.getItem('token');
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          preferences: {
            ...user.preferences,
            ...updates,
            _id: user.preferences?._id,
          },
        }),
      });

      if (response.ok) {
        const updatedUser = {
          ...user,
          preferences: {
            ...user.preferences,
            ...updates,
          },
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast({
          title: 'Succès',
          description: 'Vos préférences ont été enregistrées.',
        });
      } else {
        throw new Error('Échec de la mise à jour des préférences');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les préférences.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen py-10 bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-purple-900">
        <div className="w-full max-w-2xl space-y-4 px-4">
          <Skeleton className="h-10 w-1/4 mx-auto" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8 w-full mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-purple-900 min-h-screen"
    >
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent mb-8"
        aria-label="Profil"
      >
        Profil
      </motion.h1>

      <div className="space-y-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <AvatarUpload
                  currentAvatarUrl={user.avatarUrl}
                  username={user.username}
                  onAvatarChange={handleAvatarChange}
                  disabled={isSubmitting}
                />
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isEditing ? (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-700 dark:text-gray-200">
                          Nom d'utilisateur
                        </Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              username: e.target.value,
                            }))
                          }
                          className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500"
                          aria-label="Nom d'utilisateur"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500"
                          aria-label="Adresse email"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <Button
                          onClick={handleUserInfoUpdate}
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 transition-all duration-300"
                          aria-label={isSubmitting ? 'Enregistrement en cours' : 'Enregistrer les modifications'}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enregistrement...
                            </span>
                          ) : (
                            'Enregistrer'
                          )}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({ username: user.username, email: user.email });
                          }}
                          disabled={isSubmitting}
                          className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50"
                          aria-label="Annuler les modifications"
                        >
                          Annuler
                        </Button>
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-200">
                          Nom d'utilisateur
                        </Label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100" aria-label={`Nom d'utilisateur: ${user.username}`}>
                          {user.username}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-200">
                          Email
                        </Label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100" aria-label={`Adresse email: ${user.email}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="mt-4 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-300"
                        aria-label="Modifier les informations personnelles"
                      >
                        Modifier
                      </Button>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                Préférences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label className="text-gray-700 dark:text-gray-200">Devise</Label>
                <Select
                  value={user.preferences?.currency || 'EUR'}
                  onValueChange={(value) => updatePreferences({ currency: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500">
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
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Label className="text-gray-700 dark:text-gray-200">Thème</Label>
                <div className="flex flex-wrap gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => {
                        setTheme('light');
                        if (user) {
                          updatePreferences({ theme: 'light' });
                        }
                      }}
                      disabled={isSubmitting}
                      className={
                        theme === 'light'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600'
                          : 'border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                      }
                      aria-label="Sélectionner le thème clair"
                    >
                      Clair
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => {
                        setTheme('dark');
                        if (user) {
                          updatePreferences({ theme: 'dark' });
                        }
                      }}
                      disabled={isSubmitting}
                      className={
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600'
                          : 'border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                      }
                      aria-label="Sélectionner le thème sombre"
                    >
                      Sombre
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      onClick={() => {
                        setTheme('system');
                        if (user) {
                          updatePreferences({ theme: 'system' });
                        }
                      }}
                      disabled={isSubmitting}
                      className={
                        theme === 'system'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600'
                          : 'border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                      }
                      aria-label="Sélectionner le thème du système"
                    >
                      Système
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}