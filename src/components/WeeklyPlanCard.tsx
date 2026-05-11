import React from 'react';
import { Calendar, ShoppingCart, Clock, Wallet, CheckCircle2, ChevronRight, Apple, Coffee, Pizza, Cookie } from 'lucide-react';
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

export function WeeklyPlanCard({ plan }: { plan: WeeklyPlanData }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm my-4 not-prose text-gray-900 dark:text-gray-100">
      {/* Header Summary */}
      <div className="p-6 bg-emerald-500 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={24} />
          Your Weekly Prep Plan
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 mb-1">Batch Day</div>
            <div className="text-sm font-bold">{plan.prepDay}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 mb-1">Weekly Cost</div>
            <div className="text-sm font-bold">{plan.estimatedCost}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 mb-1">Prep Time</div>
            <div className="text-sm font-bold">{plan.totalPrepTime}</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 text-gray-900 dark:text-gray-100">
        {/* Day-by-Day Schedule */}
        <div>
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-gray-500 dark:text-gray-400">
            📅 Week Schedule
          </h4>
          <div className="space-y-4">
            {plan.schedule.map((day, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-emerald-200 dark:hover:border-emerald-900">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{day.day}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <Coffee size={16} className="text-amber-500 shrink-0 mt-1" />
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Breakfast</div>
                      <div className="text-xs font-medium leading-tight">{day.breakfast}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Pizza size={16} className="text-emerald-500 shrink-0 mt-1" />
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Lunch</div>
                      <div className="text-xs font-medium leading-tight">{day.lunch}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Apple size={16} className="text-red-500 shrink-0 mt-1" />
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Dinner</div>
                      <div className="text-xs font-medium leading-tight">{day.dinner}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Cookie size={16} className="text-orange-500 shrink-0 mt-1" />
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Snack</div>
                      <div className="text-xs font-medium leading-tight">{day.snack}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping List */}
        <div>
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-gray-500 dark:text-gray-400">
            🛒 Shopping List
          </h4>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            {plan.shoppingList.map((item, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                    <CheckCircle2 size={12} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.item}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">{item.category}</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                  {item.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
