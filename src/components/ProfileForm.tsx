import React, { useState } from "react";
import { UserProfile } from "../types";
import { X, Target, Wallet, Activity, GraduationCap, Utensils, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface ProfileFormProps {
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

export function ProfileForm({ initialProfile, onSave, onClose }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      goal: "maintain",
      calories_target: 2000,
      allergies: [],
      daily_budget_idr: 50000,
      taste_preferences: [],
      disliked_foods: [],
      activity_level: "moderate",
      cooking_skill: "intermediate",
      available_time_minutes: 30,
    }
  );

  const [allergyInput, setAllergyInput] = useState("");
  const [dislikeInput, setDislikeInput] = useState("");

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const goals = [
    { value: 'diet', label: 'Weight Loss', icon: '📉', desc: 'Fokus bakar lemak' },
    { value: 'bulking', label: 'Muscle Gain', icon: '💪', desc: 'Tambah massa otot' },
    { value: 'maintain', label: 'Maintain', icon: '⚖️', desc: 'Jaga berat badan' },
  ];

  const tasteOptions = ["pedas", "gurih", "manis", "creamy", "asian", "western"];

  const handleAddTag = (field: "allergies" | "disliked_foods", value: string) => {
    if (value.trim() && !profile[field].includes(value.trim())) {
      handleChange(field, [...profile[field], value.trim()]);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col shadow-2xl border border-white dark:border-gray-800 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
          <div>
            <h2 className="font-heading font-black text-2xl text-stone-900 dark:text-white">Profile Nutrisi</h2>
            <p className="text-xs text-stone-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
              <CheckCircle2 size={12} className="text-emerald-500" /> Disiapkan Khusus Buat Lo
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-50 dark:hover:bg-gray-800 rounded-2xl transition-colors">
            <X size={20} className="text-stone-400" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8 no-scrollbar bg-stone-50/30 dark:bg-gray-950/30">
          {/* Target Goal */}
          <section>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-gray-500 mb-4">
              <Target size={14} className="text-emerald-500" /> Target Utama
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {goals.map((g) => (
                <button
                  key={g.value}
                  onClick={() => handleChange("goal", g.value)}
                  className={cn(
                    "p-4 rounded-[20px] text-left border-2 transition-all group flex flex-col items-center sm:items-start text-center sm:text-left",
                    profile.goal === g.value
                      ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10"
                      : "bg-white dark:bg-gray-800 border-stone-100 dark:border-gray-800 hover:border-emerald-200"
                  )}
                >
                  <span className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all block">{g.icon}</span>
                  <span className={cn("text-sm font-black font-heading mb-1", profile.goal === g.value ? "text-emerald-700 dark:text-emerald-400" : "text-stone-700 dark:text-gray-300")}>
                    {g.label}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium leading-tight">{g.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-gray-500">
                🔥 Target Kalori
              </label>
              <input
                type="number"
                value={profile.calories_target}
                onChange={(e) => handleChange("calories_target", Number(e.target.value))}
                className="w-full bg-white dark:bg-gray-800 border-2 border-stone-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-gray-500">
                💰 Budget Harian (Rp)
              </label>
              <input
                type="number"
                value={profile.daily_budget_idr}
                onChange={(e) => handleChange("daily_budget_idr", Number(e.target.value))}
                className="w-full bg-white dark:bg-gray-800 border-2 border-stone-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Taste Preferences */}
          <section>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-gray-500 mb-3">
              <Utensils size={14} className="text-emerald-500" /> Selera Makan
            </label>
            <div className="flex flex-wrap gap-2">
              {tasteOptions.map((taste) => (
                <button
                  key={taste}
                  onClick={() => {
                    const exists = profile.taste_preferences.includes(taste);
                    handleChange("taste_preferences", exists 
                      ? profile.taste_preferences.filter(t => t !== taste)
                      : [...profile.taste_preferences, taste]
                    );
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full border-2 text-xs font-bold transition-all",
                    profile.taste_preferences.includes(taste)
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-white dark:bg-gray-800 border-stone-100 dark:border-gray-800 hover:border-emerald-200 text-stone-600 dark:text-gray-400"
                  )}
                >
                  {taste}
                </button>
              ))}
            </div>
          </section>

          {/* Allergies & Dislikes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-gray-500">
                🚫 Alergi
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddTag("allergies", allergyInput);
                      setAllergyInput("");
                    }
                  }}
                  placeholder="e.g. Peanut..."
                  className="flex-1 bg-white dark:bg-gray-800 border-2 border-stone-100 dark:border-gray-800 rounded-xl px-4 py-2 text-xs font-bold focus:border-red-500 outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map(a => (
                  <span key={a} className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-red-100 dark:border-red-900/50">
                    {a}
                    <X size={10} className="cursor-pointer" onClick={() => handleChange("allergies", profile.allergies.filter(x => x !== a))} />
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-gray-500">
                ❌ Gak Suka
              </label>
               <input
                  type="text"
                  value={dislikeInput}
                  onChange={(e) => setDislikeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddTag("disliked_foods", dislikeInput);
                      setDislikeInput("");
                    }
                  }}
                  placeholder="e.g. Pete..."
                  className="w-full bg-white dark:bg-gray-800 border-2 border-stone-100 dark:border-gray-800 rounded-xl px-4 py-2 text-xs font-bold focus:border-stone-400 outline-none"
                />
              <div className="flex flex-wrap gap-2">
                {profile.disliked_foods.map(f => (
                  <span key={f} className="bg-stone-100 dark:bg-gray-800 text-stone-500 dark:text-gray-400 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-stone-200 dark:border-gray-700">
                    {f}
                    <X size={10} className="cursor-pointer" onClick={() => handleChange("disliked_foods", profile.disliked_foods.filter(x => x !== f))} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Activity & Skill */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
             <section>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-gray-500 mb-4">
                 <Activity size={14} className="text-emerald-500" /> Aktivitas Harian
               </label>
               <div className="space-y-2">
                 {['sedentary', 'moderate', 'active', 'very_active'].map((act) => (
                   <button
                     key={act}
                     onClick={() => handleChange("activity_level", act)}
                     className={cn(
                       "w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all",
                       profile.activity_level === act 
                         ? "bg-violet-50 dark:bg-violet-500/10 border-violet-500 text-violet-700 dark:text-violet-400 shadow-sm" 
                         : "bg-white dark:bg-gray-800 border-stone-100 dark:border-gray-800 hover:border-violet-200"
                     )}
                   >
                     <span className="text-xs font-black uppercase tracking-tight">{act.replace('_', ' ')}</span>
                     {profile.activity_level === act && <CheckCircle2 size={14} />}
                   </button>
                 ))}
               </div>
            </section>
            <section>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-gray-500 mb-4">
                 <GraduationCap size={14} className="text-emerald-500" /> Skill Masak
               </label>
               <div className="space-y-2">
                 {['beginner', 'intermediate', 'advanced'].map((skill) => (
                   <button
                     key={skill}
                     onClick={() => handleChange("cooking_skill", skill)}
                     className={cn(
                       "w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all",
                       profile.cooking_skill === skill 
                         ? "bg-amber-50 dark:bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 shadow-sm" 
                         : "bg-white dark:bg-gray-800 border-stone-100 dark:border-gray-800 hover:border-amber-200"
                     )}
                   >
                     <span className="text-xs font-black uppercase tracking-tight">{skill}</span>
                     {profile.cooking_skill === skill && <CheckCircle2 size={14} />}
                   </button>
                 ))}
               </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-3 z-10 sm:rounded-b-[32px]">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl text-stone-400 font-bold hover:bg-stone-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(profile)}
            className="flex-[2] bg-stone-900 dark:bg-emerald-600 hover:bg-stone-800 dark:hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-stone-900/10 dark:shadow-emerald-500/20"
          >
            <CheckCircle2 size={20} /> Simpan Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}
