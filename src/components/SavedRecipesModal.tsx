import React, { useState } from 'react';
import { X, Bookmark, Search } from 'lucide-react';
import { RecipeData, RecipeCard } from './RecipeCard';
import { cn } from '../lib/utils';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col shadow-xl border border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 rounded-t-[32px] z-10 transition-colors duration-300">
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Bookmark className="text-emerald-500" size={20} fill="currentColor" /> 
              Saved Recipes
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Your bookmarked meals</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#F9FAFB] dark:bg-gray-950">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {(['all', 'easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setFilter(diff)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border shadow-sm",
                  filter === diff 
                    ? "bg-emerald-600 text-white border-emerald-600" 
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                {diff === 'all' ? 'All Recipes' : diff}
              </button>
            ))}
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bookmark className="text-gray-400" size={24} />
              </div>
              <h3 className="text-gray-900 dark:text-white font-bold mb-1">No recipes found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filter === 'all' ? "You haven't saved any recipes yet." : `No saved recipes with ${filter} difficulty.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecipes.map((recipe, idx) => (
                <RecipeCard 
                  key={idx} 
                  recipe={recipe} 
                  isSaved={true} 
                  onToggleSave={() => onToggleSave(recipe)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
