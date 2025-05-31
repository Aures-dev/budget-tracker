'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBudget } from '@/contexts/BudgetContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().min(1, 'Le montant est requis'),
  category: z.string().min(1, 'La catégorie est requise'),
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  date: z.date(),
});

export function TransactionForm() {
  const { addTransaction, getCategoryOptions, formatCurrency } = useBudget();
  const { toast } = useToast();
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'expense',
      amount: '',
      category: '',
      title: '',
      description: '',
      date: new Date(),
    },
  });

  const type = form.watch('type');
  const categories = getCategoryOptions(type);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const finalCategory = values.category === 'Autre' ? customCategory : values.category;

      await addTransaction({
        type: values.type,
        amount: parseFloat(values.amount),
        category: finalCategory,
        title: values.title,
        description: values.description || '',
        date: format(values.date, 'yyyy-MM-dd'),
      });

      form.reset();
      setCustomCategory('');
      setShowCustomCategory(false);

      toast({
        title: 'Transaction ajoutée',
        description: `${values.type === 'income' ? 'Revenu' : 'Dépense'} de ${formatCurrency(parseFloat(values.amount))} ajouté avec succès.`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'ajout de la transaction.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-200">Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500">
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="expense">Dépense</SelectItem>
                    <SelectItem value="income">Revenu</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-200">Titre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Courses du mois"
                    className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500"
                    {...field}
                    aria-label="Titre de la transaction"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-200">Montant</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500"
                    {...field}
                    aria-label="Montant de la transaction"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-200">Catégorie</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowCustomCategory(value === 'Autre');
                    if (value !== 'Autre') {
                      setCustomCategory('');
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {showCustomCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-200">Nouvelle catégorie</FormLabel>
              <FormControl>
                <Input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Entrez une nouvelle catégorie"
                  className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500"
                  aria-label="Nouvelle catégorie"
                />
              </FormControl>
            </FormItem>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-200">Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Description (optionnel)"
                    className="border-purple-300 dark:border-purple-700 focus:ring-2 focus:ring-purple-500"
                    {...field}
                    aria-label="Description de la transaction"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-700 dark:text-gray-200">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/50',
                          !field.value && 'text-muted-foreground'
                        )}
                        aria-label="Sélectionner une date"
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 shadow-lg rounded-lg">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
            disabled={isSubmitting}
            aria-label={isSubmitting ? 'Ajout en cours' : 'Ajouter la transaction'}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </span>
            ) : (
              'Ajouter la transaction'
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}