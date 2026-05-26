import React, { useState } from 'react';
import { Share2, Bookmark, ChefHat, Flame, Drumstick, Wheat, Droplet, CheckCircle2, ChevronDown, ChevronUp, Copy, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface RecipeData {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard" | string;
  macros: { calories: number; protein: number; carbs: number; fat: number; };
  ingredients: string[];
  steps: string[];
  tips?: string[];
  nutrition?: {
    vitaminA?: string;
    vitaminC?: string;
    iron?: string;
    calcium?: string;
    [key: string]: string | undefined;
  };
}

export function RecipeCard({ recipe, isSaved = false, onToggleSave }: { recipe: RecipeData; isSaved?: boolean; onToggleSave?: () => void }) {
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState<number>(() => {
    try {
      const savedRatings = JSON.parse(localStorage.getItem('prepmate_ratings') || '{}');
      return savedRatings[recipe.title] || 0;
    } catch { return 0; }
  });

  const handleRate = (newRating: number) => {
    setRating(newRating);
    try {
      const savedRatings = JSON.parse(localStorage.getItem('prepmate_ratings') || '{}');
      savedRatings[recipe.title] = newRating;
      localStorage.setItem('prepmate_ratings', JSON.stringify(savedRatings));
    } catch {}
  };

  const handleShare = async () => {
    const recipeObject = { type: 'recipe', data: recipe };
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('sharedRecipe', btoa(encodeURIComponent(JSON.stringify(recipeObject))));
    const shareUrl = url.toString();

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Cek resep ini di PrepMate AI: ${recipe.title}`,
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to clipboard if share fails (e.g. in iframe without permission)
        navigator.clipboard.writeText(shareUrl);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleCopyRecipe = () => {
    const ingredientList = recipe.ingredients.map(ing => `- ${ing}`).join('\n');
    const stepList = recipe.steps.map((step, i) => `${i + 1}. ${step}`).join('\n');
    const text = `Resep: ${recipe.title}\n\nBahan-bahan:\n${ingredientList}\n\nCara Memasak:\n${stepList}`;
    navigator.clipboard.writeText(text);
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2000);
  };

  const difficultyColors = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  const diffColor = difficultyColors[recipe.difficulty.toLowerCase() as keyof typeof difficultyColors] || difficultyColors.medium;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-stone-200 dark:border-gray-800 overflow-hidden shadow-sm my-4 not-prose text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
        <div className="min-w-0 flex-1 pl-0.5 sm:pl-1 w-full">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
             <ChefHat size={18} className="text-emerald-500 shrink-0" />
             <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", diffColor)}>
               {recipe.difficulty}
             </span>
          </div>
          <h3 className="text-lg font-heading font-bold tracking-tight mb-1 break-words leading-snug">{recipe.title}</h3>
          <p className="text-sm text-stone-500 dark:text-gray-400 font-medium leading-tight mb-3 break-words">{recipe.description}</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star} 
                onClick={() => handleRate(star)}
                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <Star 
                  size={16} 
                  className={cn(
                    "transition-colors", 
                    rating >= star ? "text-amber-400 fill-amber-400" : "text-stone-200 dark:text-gray-700 hover:text-amber-200 dark:hover:text-amber-900/50"
                  )} 
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0 self-end sm:self-auto w-full sm:w-auto justify-end sm:justify-start">
          <button 
            onClick={handleCopyRecipe}
            className="p-2 hover:bg-stone-50 dark:hover:bg-gray-800 rounded-xl transition-colors text-stone-500 dark:text-gray-400 relative border border-transparent hover:border-stone-200 dark:hover:border-gray-700 flex-1 sm:flex-none flex justify-center"
            title="Copy Recipe Details"
          >
            {copiedRecipe ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
          </button>
          <button 
            onClick={handleShare}
            className="p-2 hover:bg-stone-50 dark:hover:bg-gray-800 rounded-xl transition-colors text-stone-500 dark:text-gray-400 relative border border-transparent hover:border-stone-200 dark:hover:border-gray-700 flex-1 sm:flex-none flex justify-center"
            title="Share"
          >
            {copiedShare ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Share2 size={18} />}
          </button>
          <button 
            onClick={onToggleSave}
            className={cn(
              "p-2 rounded-xl transition-colors border-2 flex-1 sm:flex-none flex justify-center",
              isSaved 
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900" 
                : "bg-white dark:bg-gray-900 hover:bg-stone-50 dark:hover:bg-gray-800 text-stone-400 dark:text-gray-500 border-stone-100 dark:border-gray-800"
            )}
            title="Save Recipe"
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-4 divide-x divide-stone-100 dark:divide-gray-800 bg-stone-50/50 dark:bg-gray-800/50 border-b border-stone-100 dark:border-gray-800">
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
            <Flame size={14} />
          </div>
          <div className="text-sm font-bold">{recipe.macros.calories}</div>
          <div className="text-[10px] text-stone-500 dark:text-gray-500 uppercase font-bold tracking-wider">Kcal</div>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
            <Drumstick size={14} />
          </div>
          <div className="text-sm font-bold">{recipe.macros.protein}g</div>
          <div className="text-[10px] text-stone-500 dark:text-gray-500 uppercase font-bold tracking-wider">Prot</div>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
            <Wheat size={14} />
          </div>
          <div className="text-sm font-bold">{recipe.macros.carbs}g</div>
          <div className="text-[10px] text-stone-500 dark:text-gray-500 uppercase font-bold tracking-wider">Carb</div>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
            <Droplet size={14} />
          </div>
          <div className="text-sm font-bold">{recipe.macros.fat}g</div>
          <div className="text-[10px] text-stone-500 dark:text-gray-500 uppercase font-bold tracking-wider">Fat</div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 bg-stone-100/50 dark:bg-gray-800/80 hover:bg-stone-200 dark:hover:bg-gray-700 rounded-xl text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-gray-300 transition-all"
        >
          {isExpanded ? (
            <>Sembunyikan Detail <ChevronUp size={16} /></>
          ) : (
            <>Lihat Detail Resep <ChevronDown size={16} /></>
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-1 px-2 sm:px-4 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
                
                {/* Nutrition Full Details (If available) */}
                {recipe.nutrition && (
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 mt-4">
                    <h4 className="text-[10px] font-bold mb-3 flex items-center gap-1.5 uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                      <Droplet size={14} /> Nutrition Facts (2000 kcal DV)
                    </h4>
                    <div className="grid grid-cols-2 gap-[12px] text-xs">
                      {Object.entries(recipe.nutrition).map(([key, val]) => (
                        <div key={key} className="flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 border border-blue-50 dark:border-blue-900/20 p-2 sm:px-3 rounded-lg min-w-0">
                          <span className="font-medium text-stone-600 dark:text-gray-400 capitalize text-[10px] sm:text-xs leading-tight mb-0.5 break-words max-w-full">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-bold text-blue-700 dark:text-blue-300 text-xs sm:text-sm break-words max-w-full">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 border-t border-stone-100 dark:border-gray-800 pt-6">
                  {/* Ingredients */}
                  <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-3 sm:p-5">
                    <h4 className="text-xs font-bold mb-4 flex items-center gap-2 uppercase tracking-[0.1em] text-emerald-800 dark:text-emerald-400">
                      <div className="bg-emerald-200 dark:bg-emerald-800/50 p-1.5 rounded-lg text-emerald-700 dark:text-emerald-300">
                         🛒
                      </div>
                      Bahan-Bahan
                    </h4>
                    <ul className="space-y-3">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span className="leading-snug text-stone-700 dark:text-gray-300 flex-1 break-words">{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps */}
                  <div className="bg-stone-50/50 dark:bg-gray-800/50 border border-stone-100 dark:border-gray-700/50 rounded-2xl p-3 sm:p-5">
                    <h4 className="text-xs font-bold mb-4 flex items-center gap-2 uppercase tracking-[0.1em] text-stone-800 dark:text-gray-200">
                      <div className="bg-stone-200 dark:bg-gray-700 p-1.5 rounded-lg text-stone-600 dark:text-gray-300">
                        🍳
                      </div>
                      Cara Memasak
                    </h4>
                    <ul className="space-y-4">
                      {recipe.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="shrink-0 w-6 h-6 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-stone-600 dark:text-gray-300 border border-stone-200 dark:border-gray-600 shadow-sm">
                            {i + 1}
                          </span>
                          <span className="pt-0.5 leading-relaxed font-medium text-stone-700 dark:text-gray-300 flex-1 break-words">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Cooking Tips */}
                {recipe.tips && recipe.tips.length > 0 && (
                  <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-3 sm:p-5">
                    <h4 className="text-xs font-bold mb-3 flex items-center gap-2 uppercase tracking-[0.1em] text-amber-800 dark:text-amber-500">
                      💡 Cooking Tips & Swaps
                    </h4>
                    <ul className="space-y-2">
                      {recipe.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-medium text-stone-700 dark:text-gray-300">
                          <span className="text-amber-500 shrink-0 select-none mt-0.5">•</span>
                          <span className="flex-1 break-words">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
