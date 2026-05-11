import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Plus, Minus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function CookingTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Optional: sound notification if possible in browser
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    const mins = parseInt(inputMinutes);
    if (!isNaN(mins) && mins > 0) {
      setTimeLeft(mins * 60);
      setIsActive(true);
      setInputMinutes('');
    }
  };

  const adjustTime = (mins: number) => {
    setTimeLeft(prev => Math.max(0, prev + mins * 60));
  };

  return (
    <div className="relative">
      <motion.div 
        layout
        className={cn(
          "bg-white dark:bg-gray-900 border border-stone-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col items-center justify-center",
          isOpen ? "rounded-[24px] p-4 w-64 mt-2 absolute right-0 top-full z-50 origin-top-right shadow-xl" : "rounded-full p-1 h-10 w-auto"
        )}
      >
        <div className={cn(isOpen ? "flex flex-col w-full" : "flex items-center gap-2 px-3 h-full")}>
           <button 
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 transition-colors",
              !isOpen ? "text-stone-600 dark:text-gray-400 hover:text-emerald-600" : "text-stone-400 mb-4 w-full justify-between"
            )}
           >
               <div className="flex items-center gap-2">
               <Timer size={18} className={isActive ? "text-emerald-500 animate-pulse" : ""} />
               {!isOpen && timeLeft > 0 && <span className="text-xs font-black font-mono tracking-tight">{formatTime(timeLeft)}</span>}
               {!isOpen && timeLeft === 0 && <span className="text-xs font-bold uppercase tracking-widest inline">Timer</span>}
             </div>
             {isOpen && <X size={18} />}
           </button>

           <AnimatePresence>
             {isOpen && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="w-full space-y-4"
               >
                 <div className="text-center">
                    <div className="text-3xl font-black font-mono tracking-tighter text-stone-800 dark:text-white tabular-nums">
                      {formatTime(timeLeft)}
                    </div>
                 </div>

                 {timeLeft === 0 && !isActive ? (
                   <div className="flex gap-2">
                      <input
                        type="number"
                        value={inputMinutes}
                        onChange={(e) => setInputMinutes(e.target.value)}
                        placeholder="Min"
                        className="flex-1 bg-stone-50 dark:bg-gray-800 border-none rounded-xl px-3 py-2 text-sm text-center outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <button 
                        onClick={startTimer}
                        disabled={!inputMinutes}
                        className="bg-emerald-500 text-white p-2 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
                      >
                        <Play size={18} fill="currentColor" />
                      </button>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     <div className="flex justify-center gap-3">
                        <button onClick={() => adjustTime(-1)} className="p-2 hover:bg-stone-50 dark:hover:bg-gray-800 rounded-lg text-stone-500"><Minus size={16} /></button>
                        <button 
                          onClick={() => setIsActive(!isActive)}
                          className={cn(
                            "w-12 h-12 flex items-center justify-center rounded-full transition-colors",
                            isActive ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-500 text-white"
                          )}
                        >
                          {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                        <button onClick={() => adjustTime(1)} className="p-2 hover:bg-stone-50 dark:hover:bg-gray-800 rounded-lg text-stone-500"><Plus size={16} /></button>
                     </div>
                     <button 
                       onClick={() => { setTimeLeft(0); setIsActive(false); }}
                       className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors"
                     >
                       <RotateCcw size={12} /> Reset Timer
                     </button>
                   </div>
                 )}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>

      {/* Overlay to close when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
