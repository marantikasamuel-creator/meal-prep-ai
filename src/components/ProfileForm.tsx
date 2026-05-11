import React, { useState } from "react";
import { UserProfile } from "../types";
import { X } from "lucide-react";

interface ProfileFormProps {
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

export function ProfileForm({ initialProfile, onSave, onClose }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      goal: "",
      calories_target: 2000,
      allergies: [],
      daily_budget_idr: 50000,
      taste_preferences: [],
      disliked_foods: [],
      activity_level: "",
      cooking_skill: "",
      available_time_minutes: 30,
    }
  );

  const [allergyInput, setAllergyInput] = useState("");
  const [dislikeInput, setDislikeInput] = useState("");

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const togglePreference = (pref: string) => {
    if (profile.taste_preferences.includes(pref)) {
      handleChange(
        "taste_preferences",
        profile.taste_preferences.filter((p) => p !== pref)
      );
    } else {
      handleChange("taste_preferences", [...profile.taste_preferences, pref]);
    }
  };

  const handleAllergyAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && allergyInput.trim()) {
      e.preventDefault();
      if (!profile.allergies.includes(allergyInput.trim())) {
        handleChange("allergies", [...profile.allergies, allergyInput.trim()]);
      }
      setAllergyInput("");
    }
  };

  const handleDislikeAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && dislikeInput.trim()) {
      e.preventDefault();
      if (!profile.disliked_foods.includes(dislikeInput.trim())) {
        handleChange("disliked_foods", [...profile.disliked_foods, dislikeInput.trim()]);
      }
      setDislikeInput("");
    }
  };

  const tasteOptions = ["pedas", "gurih", "manis", "creamy", "asian", "western"];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col shadow-xl border border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 rounded-t-[32px] z-10 transition-colors duration-300">
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">🎯 Your Goals & Profile</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Help me tailor the best meals for you!</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Goal */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {["diet", "bulking", "maintain"].map((g) => (
                <button
                  key={g}
                  onClick={() => handleChange("goal", g)}
                  className={"py-3 px-3 rounded-2xl border text-sm font-bold transition-all " +
                    (profile.goal === g
                      ? "bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-400 shadow-sm"
                      : "bg-[#F9FAFB] dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target Calories</label>
              <input
                type="number"
                value={profile.calories_target}
                onChange={(e) => handleChange("calories_target", Number(e.target.value))}
                className="w-full bg-[#F3F4F6] dark:bg-gray-800 border border-transparent rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Daily Budget (Rp)</label>
              <input
                type="number"
                value={profile.daily_budget_idr}
                onChange={(e) => handleChange("daily_budget_idr", Number(e.target.value))}
                className="w-full bg-[#F3F4F6] dark:bg-gray-800 border border-transparent rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Taste Preferences</label>
            <div className="flex flex-wrap gap-2">
              {tasteOptions.map((taste) => (
                <button
                  key={taste}
                  onClick={() => togglePreference(taste)}
                  className={"py-2 px-4 rounded-full border text-xs font-bold transition-all " +
                    (profile.taste_preferences.includes(taste)
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                >
                  {taste}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allergies (Press Enter)</label>
            <input
              type="text"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyDown={handleAllergyAdd}
              placeholder="e.g. dairy, nuts..."
              className="w-full bg-[#F3F4F6] dark:bg-gray-800 border border-transparent rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all font-medium mb-2"
            />
            {profile.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-xl text-xs font-bold border border-red-100 dark:border-red-500/30">
                    {a}
                    <button onClick={() => handleChange("allergies", profile.allergies.filter((x) => x !== a))}>
                      <X size={14} className="hover:text-red-900 dark:hover:text-red-300" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Disliked Foods (Press Enter)</label>
            <input
              type="text"
              value={dislikeInput}
              onChange={(e) => setDislikeInput(e.target.value)}
              onKeyDown={handleDislikeAdd}
              placeholder="e.g. jengkol, pete..."
              className="w-full bg-[#F3F4F6] dark:bg-gray-800 border border-transparent rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all font-medium mb-2"
            />
            {profile.disliked_foods.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.disliked_foods.map((food) => (
                  <span key={food} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700">
                    {food}
                    <button onClick={() => handleChange("disliked_foods", profile.disliked_foods.filter((x) => x !== food))}>
                      <X size={14} className="hover:text-gray-900 dark:hover:text-gray-100" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activity Level</label>
              <select
                value={profile.activity_level}
                onChange={(e) => handleChange("activity_level", e.target.value)}
                className="w-full bg-[#F3F4F6] dark:bg-gray-800 border border-transparent rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all font-medium appearance-none"
              >
                <option value="">Select...</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>
            
             <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cooking Skill</label>
              <select
                value={profile.cooking_skill}
                onChange={(e) => handleChange("cooking_skill", e.target.value)}
                className="w-full bg-[#F3F4F6] dark:bg-gray-800 border border-transparent rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all font-medium appearance-none"
              >
                <option value="">Select...</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

        </div>

        <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-[#F9FAFB] dark:bg-gray-950 rounded-b-[32px] transition-colors duration-300">
          <button
            onClick={() => {
              if (!profile.goal || !profile.activity_level || !profile.cooking_skill) {
                alert("Please fill out goal, activity level, and cooking skill");
                return;
              }
              onSave(profile);
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-md active:scale-[0.98]"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
