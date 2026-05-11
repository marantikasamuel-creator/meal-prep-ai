import React, { useState } from 'react';
import { Share2, Bookmark, ChefHat, Flame, Drumstick, Wheat, Droplet, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface RecipeData {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard" | string;
  macros: { calories: number; protein: number; carbs: number; fat: number; };
  ingredients: string[];
  steps: string[];
}

export function RecipeCard({ recipe, isSaved = false, onToggleSave }: { recipe: RecipeData; isSaved?: boolean; onToggleSave?: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `Check out this recipe: ${recipe.title}\n\nCalories: ${recipe.macros.calories}kcal\nProtein: ${recipe.macros.protein}g`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled or error
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const difficultyColors = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  const diffColor = difficultyColors[recipe.difficulty.toLowerCase() as keyof typeof difficultyColors] || difficultyColors.medium;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm my-4 not-prose text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
             <ChefHat size={18} className="text-emerald-500" />
             <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", diffColor)}>
               {recipe.difficulty}
             </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-1">{recipe.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{recipe.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 dark:text-gray-400 relative"
            title="Share"
          >
            {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Share2 size={18} />}
          </button>
          <button 
            onClick={onToggleSave}
            className={cn(
              "p-2 rounded-xl transition-colors",
              isSaved 
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            )}
            title="Save Recipe"
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-800 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
            <Flame size={14} />
          </div>
          <div className="text-sm font-bold">{recipe.macros.calories}</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Kcal</div>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
            <Drumstick size={14} />
          </div>
          <div className="text-sm font-bold">{recipe.macros.protein}g</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Protein</div>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
            <Wheat size={14} />
          </div>
          <div className="text-sm font-bold">{recipe.macros.carbs}g</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Carbs</div>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
            <Droplet size={14} />
          </div>
          <div className="text-sm font-bold">{recipe.macros.fat}g</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Fat</div>
        </div>
      </div>

      <div className="p-4 sm:p-5 grid gap-6 sm:grid-cols-2">
        {/* Ingredients */}
        <div>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wider text-gray-500 dark:text-gray-400">
            🛒 Ingredients
          </h4>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wider text-gray-500 dark:text-gray-400">
            🍳 Instructions
          </h4>
          <ul className="space-y-4">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                  {i + 1}
                </span>
                <span className="pt-0.5 leading-relaxed font-medium">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
