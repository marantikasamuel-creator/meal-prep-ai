import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Timer as TimerIcon } from 'lucide-react';

export function CookingTimer() {
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
      // Play a sound or notification here if needed
      if (window.AudioContext) {
        const audioCtx = new window.AudioContext();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    if (timeLeft > 0) {
      setIsActive(true);
    } else if (inputMinutes) {
      const mins = parseInt(inputMinutes, 10);
      if (!isNaN(mins) && mins > 0) {
        setTimeLeft(mins * 60);
        setIsActive(true);
      }
    }
  };

  const togglePause = () => setIsActive(!isActive);
  
  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    setInputMinutes('');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-emerald-50 dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 rounded-xl p-2 shadow-sm flex items-center gap-3 shrink-0">
      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide">
        <TimerIcon size={14} />
        <span className="hidden sm:inline">Timer</span>
      </div>
      
      {timeLeft === 0 && !isActive ? (
        <div className="flex gap-1.5">
          <input
            type="number"
            min="1"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            placeholder="Min"
            className="w-14 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-gray-600 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-emerald-500 font-medium text-gray-900 dark:text-gray-100 text-center"
          />
          <button
            onClick={startTimer}
            disabled={!inputMinutes}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 disabled:dark:bg-emerald-800 disabled:cursor-not-allowed text-white px-2 py-1 rounded-lg flex items-center justify-center transition-colors"
          >
            <Play size={12} fill="currentColor" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 rounded-lg px-2 py-1 border border-emerald-100 dark:border-gray-600">
          <div className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
            {formatTime(timeLeft)}
          </div>
          <div className="flex gap-1">
            <button
              onClick={togglePause}
              className="px-1.5 py-1 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors"
            >
              {isActive ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
            </button>
            <button
              onClick={stopTimer}
              className="px-1.5 py-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded flex items-center justify-center text-red-500 transition-colors"
            >
              <Square size={12} fill="currentColor" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
