import React, { useState } from 'react';
import { X, Bookmark, Search, ChefHat, Calendar } from 'lucide-react';
import { RecipeData, RecipeCard } from './RecipeCard';
import { WeeklyPlanCard, WeeklyPlanData } from './WeeklyPlanCard';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SavedRecipesModalProps {
  savedRecipes: RecipeData[];
  savedPlans?: WeeklyPlanData[];
  onClose: () => void;
  onToggleSave: (recipe: RecipeData) => void;
  onToggleSavePlan?: (plan: WeeklyPlanData) => void;
}

export function SavedRecipesModal({ savedRecipes, savedPlans = [], onClose, onToggleSave, onToggleSavePlan }: SavedRecipesModalProps) {
  const [activeTab, setActiveTab] = useState<'recipes' | 'plans'>('recipes');
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = savedRecipes.filter(recipe => {
    const matchesFilter = filter === 'all' ? true : recipe.difficulty.toLowerCase() === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = recipe.title.toLowerCase().includes(searchLower) || recipe.ingredients.some(ing => ing.toLowerCase().includes(searchLower));
    return matchesFilter && matchesSearch;
  });

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
              Item Simpanan
            </h2>
            <p className="text-xs text-stone-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Koleksi Masakan & Plan Lo</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-50 dark:hover:bg-gray-800 rounded-2xl transition-colors">
            <X size={20} className="text-stone-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100 dark:border-gray-800 px-6 pt-4 gap-6 select-none">
          <button 
            onClick={() => setActiveTab('recipes')}
            className={cn(
              "pb-4 text-sm font-bold tracking-wide transition-colors border-b-2 relative",
              activeTab === 'recipes' ? "text-emerald-500 border-emerald-500" : "text-stone-500 border-transparent hover:text-stone-700 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            Resep ({savedRecipes.length})
          </button>
          <button 
            onClick={() => setActiveTab('plans')}
            className={cn(
              "pb-4 text-sm font-bold tracking-wide transition-colors border-b-2 relative",
              activeTab === 'plans' ? "text-emerald-500 border-emerald-500" : "text-stone-500 border-transparent hover:text-stone-700 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            Meal Plan ({savedPlans.length})
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-stone-50/30 dark:bg-gray-950/30 no-scrollbar">
          {activeTab === 'recipes' && (
            <>
              {/* Search and Filters */}
              <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari resep atau bahan..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border-2 border-stone-100 dark:border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-stone-900 dark:text-gray-100 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
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
                  {filter === 'all' && !searchQuery
                    ? "Resep yang lo save bakal muncul di sini biar gampang dicari kapan aja." 
                    : `Gak ada resep dengan tingkat kesulitan ${filter} atau yang cocok sama pencarian.`}
                </p>
                {(filter !== 'all' || searchQuery) && (
                   <button 
                    onClick={() => { setFilter('all'); setSearchQuery(''); }}
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
          </>
          )}

          {activeTab === 'plans' && (
            <AnimatePresence mode="wait">
              {savedPlans.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-16 px-4"
                >
                  <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-[28px] border-2 border-stone-100 dark:border-gray-700 flex items-center justify-center mx-auto mb-6 shadow-sm rotate-3">
                    <Calendar className="text-stone-300 dark:text-gray-600" size={32} />
                  </div>
                  <h3 className="text-xl font-heading font-black text-stone-900 dark:text-white mb-2">Belum ada plan, nih!</h3>
                  <p className="text-sm text-stone-500 dark:text-gray-400 font-medium max-w-xs mx-auto">
                    Meal plan yang lo save bakal muncul di sini biar gampang dicari kapan aja.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 pb-8"
                >
                  {savedPlans.map((plan, idx) => (
                    <WeeklyPlanCard 
                      key={idx} 
                      plan={plan} 
                      isSaved={true} 
                      onToggleSave={() => onToggleSavePlan && onToggleSavePlan(plan)} 
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
