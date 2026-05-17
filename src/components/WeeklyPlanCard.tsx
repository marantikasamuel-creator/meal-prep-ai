import React, { useState } from 'react';
import { Calendar, ShoppingCart, Clock, Wallet, CheckCircle2, ChevronRight, Apple, Coffee, Pizza, Cookie, ChevronDown, ChevronUp, Bookmark, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export interface WeeklyPlanData {
  prepDay: string;
  estimatedCost: string;
  totalPrepTime: string;
  shoppingList: { item: string; amount: string; category: string }[];
  schedule: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  }[];
}

const formatItemName = (name: string) => {
  let summarized = name;
  if (summarized.includes('/')) {
    const parts = summarized.split('/');
    summarized = parts[0];
  } else if (summarized.toLowerCase().includes(' atau ')) {
    const parts = summarized.toLowerCase().split(' atau ');
    summarized = parts[0];
  } else if (summarized.toLowerCase().includes(' or ')) {
    const parts = summarized.toLowerCase().split(' or ');
    summarized = parts[0];
  }
  return summarized.trim();
};

export function WeeklyPlanCard({ plan, isSaved = false, onToggleSave }: { plan: WeeklyPlanData; isSaved?: boolean; onToggleSave?: () => void }) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const activeDay = plan.schedule[activeDayIdx];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-stone-200 dark:border-gray-800 shadow-sm my-4 not-prose text-stone-900 dark:text-gray-100 w-full" style={{ overflow: 'clip' }}>
      {/* Header Summary */}
      <div className="p-6 bg-emerald-500 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Calendar size={120} />
        </div>
        <div className="flex justify-between items-start relative z-10 mb-4 gap-4 w-full">
          <h3 className="text-xl font-heading font-bold flex items-center gap-2 min-w-0">
            <Calendar size={24} className="shrink-0" />
            <span className="break-words whitespace-normal leading-tight">Your Weekly Prep Plan</span>
          </h3>
          <button 
            onClick={onToggleSave}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors relative flex justify-center shrink-0 border border-transparent"
            title={isSaved ? "Hapus dari Simpanan" : "Simpan Plan"}
          >
            <Bookmark size={20} className={cn(isSaved ? "fill-white text-white" : "text-white/80")} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/20">
            <div className="text-[9px] uppercase font-bold tracking-widest text-emerald-100 mb-1">Batch Day</div>
            <div className="text-[11px] sm:text-[13px] font-bold leading-tight break-words">{plan.prepDay}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/20">
            <div className="text-[9px] uppercase font-bold tracking-widest text-emerald-100 mb-1">Est. Cost</div>
            <div className="text-[11px] sm:text-[13px] font-bold leading-tight break-words">{plan.estimatedCost}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/20">
            <div className="text-[9px] uppercase font-bold tracking-widest text-emerald-100 mb-1">Prep Time</div>
            <div className="text-[11px] sm:text-[13px] font-bold leading-tight break-words">{plan.totalPrepTime}</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Day-by-Day Schedule Tabs */}
        <div>
          <h4 className="text-[10px] font-bold mb-4 flex items-center gap-2 uppercase tracking-[0.2em] text-stone-400 dark:text-gray-500">
            📅 Jadwal Harian
          </h4>
          
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {plan.schedule.map((day, i) => (
              <button
                key={i}
                onClick={() => setActiveDayIdx(i)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                  activeDayIdx === i 
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                    : "bg-stone-100 dark:bg-gray-800 text-stone-500 dark:text-gray-400 hover:bg-stone-200 dark:hover:bg-gray-700"
                )}
              >
                {day.day}
              </button>
            ))}
          </div>

          <div className="mt-4 bg-stone-50 dark:bg-gray-800/50 rounded-2xl border border-stone-100 dark:border-gray-800 p-3 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex gap-2 sm:gap-3 items-start p-2 bg-white dark:bg-gray-900 border border-stone-100 dark:border-gray-700/50 rounded-xl shadow-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">
                  <Coffee size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-stone-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">Breakfast</div>
                  <div className="text-[12px] font-bold leading-relaxed break-words text-stone-800 dark:text-gray-200">{activeDay.breakfast}</div>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 items-start p-2 bg-white dark:bg-gray-900 border border-stone-100 dark:border-gray-700/50 rounded-xl shadow-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Pizza size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-stone-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">Lunch</div>
                  <div className="text-[12px] font-bold leading-relaxed break-words text-stone-800 dark:text-gray-200">{activeDay.lunch}</div>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 items-start p-2 bg-white dark:bg-gray-900 border border-stone-100 dark:border-gray-700/50 rounded-xl shadow-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 mt-0.5">
                  <Apple size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-stone-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">Dinner</div>
                  <div className="text-[12px] font-bold leading-relaxed break-words text-stone-800 dark:text-gray-200">{activeDay.dinner}</div>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 items-start p-2 bg-white dark:bg-gray-900 border border-stone-100 dark:border-gray-700/50 rounded-xl shadow-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                  <Cookie size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-stone-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">Snack</div>
                  <div className="text-[12px] font-bold leading-relaxed break-words text-stone-800 dark:text-gray-200">{activeDay.snack}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shopping List Collapsible */}
        <div className="w-full">
          <button 
            onClick={() => setShowShoppingList(!showShoppingList)}
            className="w-full flex items-center justify-between p-4 bg-stone-100 dark:bg-gray-800 rounded-2xl hover:bg-stone-200 dark:hover:bg-gray-700 transition-all group"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-emerald-500" />
              <span className="text-sm font-bold text-stone-700 dark:text-gray-300">Daftar Belanja Mingguan</span>
              <span className="text-[10px] font-bold bg-stone-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-stone-500">
                {plan.shoppingList.length} item
              </span>
            </div>
            {showShoppingList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          <AnimatePresence>
            {showShoppingList && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
                style={{ width: '100%', overflow: 'hidden' }}
              >
                      <div className="flex bg-white dark:bg-gray-900 rounded-2xl border border-stone-100 dark:border-gray-800 divide-y divide-stone-100 dark:divide-gray-800 flex-col overflow-hidden w-full mt-3">
                        {plan.shoppingList.map((item, i) => (
                          <div 
                            key={i} 
                            className="group transition-colors cursor-pointer hover:bg-stone-50 dark:hover:bg-gray-800/50 flex-1 flex items-center p-3 sm:p-4 gap-3 w-full border-b sm:border-b-0 border-stone-100 dark:border-gray-800 last:border-0"
                            onClick={(e) => { e.preventDefault(); toggleItem(i); }}
                          >
                            <div 
                              className={cn(
                                "shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                checkedItems[i] 
                                  ? "bg-emerald-500 border-emerald-500 text-white" 
                                  : "border-stone-300 dark:border-gray-600 text-transparent group-hover:border-emerald-500"
                              )}
                            >
                              <Check size={12} className={cn("transition-opacity", checkedItems[i] ? "opacity-100" : "opacity-0")} />
                            </div>
                            
                            <div className="flex-1 min-w-0 pr-1">
                              <div className={cn(
                                "text-[13px] sm:text-sm font-bold transition-colors leading-tight break-words", 
                                checkedItems[i] ? "text-stone-400 dark:text-gray-600 line-through" : "text-stone-800 dark:text-gray-200"
                              )} title={item.item}>
                                {formatItemName(item.item)}
                              </div>
                              <div className={cn(
                                "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5 break-words", 
                                checkedItems[i] ? "text-stone-400 dark:text-gray-600" : "text-emerald-600 dark:text-emerald-500"
                              )}>
                                {item.category}
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center justify-end max-w-[35%] sm:max-w-[40%] pl-1">
                              <span className={cn(
                                "inline-block text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full text-center transition-colors min-w-fit break-words",
                                checkedItems[i] 
                                  ? "bg-stone-100 dark:bg-gray-800 text-stone-400 dark:text-gray-500" 
                                  : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                              )}>
                                {item.amount}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
