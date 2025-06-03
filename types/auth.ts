export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export interface IncomeSource {
  _id?: string;
  name: string;
  isRecurring: boolean;
  frequency: 'weekly' | 'monthly' | 'yearly';
}

export interface UserPreferences {
  _id: string;
  currency: string;
  language: string;
  theme: 'light' | 'dark' | undefined | 'system';
  incomeSources: IncomeSource[];
  defaultCategories: Array<{
    name: string;
    type: 'income' | 'expense';
  }>;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  isOnboarded: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
} 