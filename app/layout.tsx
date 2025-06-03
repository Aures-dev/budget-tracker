import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { BudgetProvider } from '@/contexts/BudgetContext';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Budget Tracker',
  description: 'Gérez vos finances personnelles efficacement',
  keywords: 'budget, finances, gestion, dépenses, économies',
  authors: [{ name: 'Aurès Assogba-zehe', url: 'https://auresaz.vercel.app' }],
  creator: 'Aurès Assogba-zehe',
  openGraph: {
    title: 'Budget Tracker',
    description: 'Gérez vos finances personnelles efficacement',
    siteName: 'Budget Tracker',
    images: '/opengraph-image.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <BudgetProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster />
          </ThemeProvider>
        </BudgetProvider>
      </body>
    </html>
  );
}