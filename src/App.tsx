import React, { useState, useRef, useEffect } from "react";
import { UserProfile, ChatMessageData } from "./types";
import { ChatMessage } from "./components/ChatMessage";
import { ProfileForm } from "./components/ProfileForm";
import { CookingTimer } from "./components/CookingTimer";
import { SavedRecipesModal } from "./components/SavedRecipesModal";
import { RecipeData } from "./components/RecipeCard";
import { chatWithPrepMate } from "./services/geminiService";
import { Settings, Send, Salad, Scan, Calendar, Recycle, Frown, Sparkles, Sun, Moon, ChefHat, Bookmark } from "lucide-react";

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<RecipeData[]>([]);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Theme effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial Greet
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          role: "model",
          content: "👋 Halo! Gue **PrepMate**, asisten meal prep AI lo.\n\nGue bisa bantu lo:\n🍱 Bikin meal plan mingguan\n📷 Detect bahan dari foto/kulkas dan suggest resep\n🔄 Smart swap kalau bahan habis\n♻️ Selamatkan sisa makanan jadi resep baru\n📊 Track kalori & makro lo\n\nMau mulai dari mana?\n1️⃣ **Bikin meal plan personal**\n2️⃣ **Scan bahan yang ada**\n3️⃣ **Lihat meal prep mingguan**\n\nKetik angkanya atau langsung cerita aja! 😄",
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (!profile) {
      setShowProfileModal(true);
      return;
    }

    const newMessage: ChatMessageData = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const responseText = await chatWithPrepMate(text, messages, profile);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: responseText,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: "Aduh, gue lagi ada kendala teknis nih. Coba lagi ya!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };

  const handleToggleSave = (recipe: RecipeData) => {
    setSavedRecipes(prev => {
      const exists = prev.some(r => r.title === recipe.title);
      if (exists) {
        return prev.filter(r => r.title !== recipe.title);
      }
      return [...prev, recipe];
    });
  };

  const quickActions = [
    { label: "Daily Plan", command: "[DAILY_PLAN] Bikin meal plan hari ini dong", icon: Salad, matchText: "1" },
    { label: "Easy Recipes", command: "[RECIPES] Minta resep yang easy (gampang dibuat)", icon: ChefHat },
    { label: "Scan Fridge", command: "[SCAN] ", icon: Scan, matchText: "2" },
    { label: "Weekly Prep", command: "[WEEKLY_PLAN] Bikin meal plan seminggu ya", icon: Calendar, matchText: "3" },
    { label: "Leftover", command: "[LEFTOVER] ", icon: Recycle },
    { label: "Mood", command: "[MOOD] capek banget pengen makan enak", icon: Frown },
    { label: "Swap", command: "[SWAP] ", icon: Sparkles },
  ];

  return (
    <div className="flex justify-center h-screen bg-[#F3F4F6] text-[#1F2937] dark:bg-gray-950 dark:text-gray-100 font-sans p-4 sm:p-6 overflow-hidden transition-colors duration-300">
      <div className="w-full max-w-[1024px] h-full flex flex-col gap-5">
        
        {/* Header Section */}
        <header className="flex justify-between items-center bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-2 sm:gap-3">
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl shrink-0">
               🍱
             </div>
             <div>
               <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">PrepMate <span className="text-emerald-500 italic">AI</span></h1>
               <div className="flex items-center gap-1.5 mt-1 sm:mt-0.5">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">NutriMind AI Online</p>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSavedModal(true)}
              className="p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl sm:rounded-2xl transition-colors relative border border-gray-100 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 shrink-0"
            >
              <Bookmark size={20} className="text-gray-600 dark:text-gray-300 w-5 h-5" />
              {savedRecipes.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold bg-emerald-500 text-white border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                  {savedRecipes.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl sm:rounded-2xl transition-colors relative border border-gray-100 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 shrink-0"
            >
              {theme === 'dark' ? <Sun size={20} className="text-gray-300 w-5 h-5" /> : <Moon size={20} className="text-gray-600 w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowProfileModal(true)}
              className="p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl sm:rounded-2xl transition-colors relative border border-gray-100 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 shrink-0"
            >
              <Settings size={20} className="text-gray-600 dark:text-gray-300 w-5 h-5" />
              {!profile && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* Main Bento Grid */}
        <div className="flex-1 flex flex-col md:grid md:grid-cols-12 md:grid-rows-6 gap-3 sm:gap-5 min-h-0">
          
          {/* Chat Messages (Large Left) */}
          <div className="flex-1 lg:col-span-8 md:col-span-7 md:row-span-6 bg-white dark:bg-gray-900 rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden min-h-0 transition-colors duration-300">
            <div className="flex justify-between items-start sm:items-center mb-4 shrink-0 flex-col sm:flex-row gap-3 sm:gap-0">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                💬 CHAT & PLANS
              </h2>
              <CookingTimer />
            </div>
            <main className="flex-1 overflow-y-auto pr-2 space-y-4">
              {!profile && messages.length > 1 && (
                <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm p-4 rounded-2xl mb-4 font-medium flex items-center gap-3">
                  <span className="text-xl">⚠️</span> 
                  Kamu belum set profile! Klik icon settings di kanan atas biar rekomendasi gue lebih akurat ya.
                </div>
              )}

              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  onSaveRecipe={handleToggleSave}
                  savedRecipes={savedRecipes}
                />
              ))}
              
              {isLoading && (
                <div className="flex w-full mb-4 justify-start">
                  <div className="bg-[#F9FAFB] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex space-x-2 items-center h-12">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </main>
          </div>

          {/* Quick Actions (Top Right - Desktop) */}
          <div className="hidden md:flex lg:col-span-4 md:col-span-5 md:row-span-3 bg-white dark:bg-[#111827] rounded-[32px] p-6 shadow-sm dark:shadow-xl border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white flex-col overflow-hidden relative transition-colors duration-300">
            <div className="absolute top-0 right-0 p-3 opacity-10">
               <Sparkles size={80} />
            </div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 z-10">⚡ QUICK ACTIONS</h2>
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 z-10">
              {quickActions.map((action, idx) => {
                const ActionIcon = action.icon;
                const needsInput = action.command.endsWith(" ");
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (needsInput) {
                        setInputValue(action.command);
                      } else {
                        handleSendMessage(action.command);
                      }
                    }}
                    className="flex text-left items-center justify-between px-4 py-3.5 bg-[#F9FAFB] dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all group shadow-sm"
                  >
                      <span className="flex items-center gap-3">
                        <ActionIcon size={18} className={needsInput ? "text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300" : "text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300"} />
                        {action.label}
                      </span>
                      <span className="text-gray-500 group-hover:text-gray-400">→</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Chat Input (Bottom Right) */}
          <div className="shrink-0 lg:col-span-4 md:col-span-5 md:row-span-3 bg-white dark:bg-gray-900 rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-end transition-colors duration-300">
             {/* Mobile Quick Actions */}
             <div className="flex md:hidden overflow-x-auto gap-2 pb-3">
               {quickActions.map((action, idx) => {
                 const ActionIcon = action.icon;
                 const needsInput = action.command.endsWith(" ");
                 return (
                   <button
                     key={idx}
                     onClick={() => {
                       if (needsInput) {
                         setInputValue(action.command);
                       } else {
                         handleSendMessage(action.command);
                       }
                     }}
                     className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 active:bg-gray-100 dark:active:bg-gray-700 transition-colors shadow-sm"
                   >
                       <ActionIcon size={14} className={needsInput ? "text-emerald-500" : "text-orange-500"} />
                       {action.label}
                   </button>
                 )
               })}
             </div>

             <div className="flex mb-3 sm:mb-4 items-center gap-3 hidden sm:flex">
                 <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 flex items-center justify-center font-bold text-lg transition-colors">📝</div>
                 <div>
                   <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight transition-colors">Ketik Pesan</h2>
                   <p className="text-[10px] text-gray-500 font-medium">Tanya resep atau update kalori</p>
                 </div>
             </div>
             
             <div className="flex flex-row sm:flex-col gap-2 sm:gap-3">
               <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputValue);
                     }
                  }}
                  placeholder="Ketik pesan..."
                  className="w-full bg-[#F3F4F6] dark:bg-gray-800 border border-transparent text-sm text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-700 transition-all resize-none h-12 sm:h-24 shadow-inner"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="shrink-0 aspect-square sm:aspect-auto sm:w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white font-bold px-4 py-0 sm:px-5 sm:py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span className="hidden sm:inline">Kirim Pesan</span> <Send size={20} className="sm:w-4 sm:h-4" />
                </button>
             </div>
          </div>

        </div>

        {/* Modals */}
        {showSavedModal && (
          <SavedRecipesModal 
            savedRecipes={savedRecipes}
            onClose={() => setShowSavedModal(false)}
            onToggleSave={handleToggleSave}
          />
        )}
        {showProfileModal && (
          <ProfileForm
            initialProfile={profile}
            onSave={(p) => {
              setProfile(p);
              setShowProfileModal(false);
              if (!profile) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    role: "model",
                    content: "Mantap! Profil udah gue update. Sekarang lo bisa mulai chat pake fitur-fitur di atas. Mau cobain yang mana nih?",
                    timestamp: new Date(),
                  }
                ]);
              }
            }}
            onClose={() => setShowProfileModal(false)}
          />
        )}
      </div>
    </div>
  );
}
