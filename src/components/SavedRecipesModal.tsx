import React, { useState } from 'react';
import { X, Bookmark, Search, ChefHat } from 'lucide-react';
import { RecipeData, RecipeCard } from './RecipeCard';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SavedRecipesModalProps {
  savedRecipes: RecipeData[];
  onClose: () => void;
  onToggleSave: (recipe: RecipeData) => void;
}

export function SavedRecipesModal({ savedRecipes, onClose, onToggleSave }: SavedRecipesModalProps) {
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredRecipes = savedRecipes.filter(r => 
    filter === 'all' ? true : r.difficulty.toLowerCase() === filter
  );

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col shadow-2xl border border-white dark:border-gray-800 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10 transition-colors">
          <div>
            <h2 className="font-heading font-black text-2xl text-stone-900 dark:text-white flex items-center gap-3">
              <Bookmark className="text-emerald-500" size={24} fill="currentColor" /> 
              Resep Simpanan
            </h2>
            <p className="text-xs text-stone-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Koleksi Masakan Lo Senjata Rahasia</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-50 dark:hover:bg-gray-800 rounded-2xl transition-colors">
            <X size={20} className="text-stone-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-stone-50/30 dark:bg-gray-950/30 no-scrollbar">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {(['all', 'easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setFilter(diff)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] transition-all border-2",
                  filter === diff 
                    ? "bg-stone-900 dark:bg-emerald-600 text-white border-stone-900 dark:border-emerald-600 shadow-lg shadow-stone-900/10 dark:shadow-emerald-500/20" 
                    : "bg-white dark:bg-gray-800 text-stone-500 dark:text-gray-400 border-stone-100 dark:border-gray-700 hover:border-stone-300 dark:hover:border-gray-600"
                )}
              >
                {diff === 'all' ? 'Semua Resep' : diff}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {filteredRecipes.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-16 px-4"
              >
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-[28px] border-2 border-stone-100 dark:border-gray-700 flex items-center justify-center mx-auto mb-6 shadow-sm rotate-3">
                  <ChefHat className="text-stone-300 dark:text-gray-600" size={32} />
                </div>
                <h3 className="text-xl font-heading font-black text-stone-900 dark:text-white mb-2">Belum ada resep, nih!</h3>
                <p className="text-sm text-stone-500 dark:text-gray-400 font-medium max-w-xs mx-auto">
                  {filter === 'all' 
                    ? "Resep yang lo save bakal muncul di sini biar gampang dicari kapan aja." 
                    : `Gak ada resep dengan tingkat kesulitan ${filter}.`}
                </p>
                {filter !== 'all' && (
                   <button 
                    onClick={() => setFilter('all')}
                    className="mt-6 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest hover:underline"
                   >
                     Lihat Semua Resep
                   </button>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 pb-8"
              >
                {filteredRecipes.map((recipe, idx) => (
                  <RecipeCard 
                    key={idx} 
                    recipe={recipe} 
                    isSaved={true} 
                    onToggleSave={() => onToggleSave(recipe)} 
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
