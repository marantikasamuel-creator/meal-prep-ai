import React from "react";
import Markdown from "react-markdown";
import { ChatMessageData } from "../types";
import { cn } from "../lib/utils";
import { RecipeCard, RecipeData } from "./RecipeCard";
import { WeeklyPlanCard, WeeklyPlanData } from "./WeeklyPlanCard";

interface ChatMessageProps {
  message: ChatMessageData;
  onSaveRecipe?: (recipe: RecipeData) => void;
  savedRecipes?: RecipeData[];
  onSavePlan?: (plan: WeeklyPlanData) => void;
  savedPlans?: WeeklyPlanData[];
}

export function ChatMessage({ message, onSaveRecipe, savedRecipes = [], onSavePlan, savedPlans = [] }: ChatMessageProps) {
  const isUser = message.role === "user";

  const renderContent = (content: string) => {
    // Regex to match ```json ... ``` blocks
    const regex = /```(?:json)?\s*\n([\s\S]*?)\n```/gi;
    const matches = [...content.matchAll(regex)];

    if (matches.length === 0) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.type === "recipe" && parsed.data) {
           const isSaved = savedRecipes.some(r => r.title === parsed.data.title);
           return (
              <RecipeCard 
                recipe={parsed.data} 
                isSaved={isSaved}
                onToggleSave={() => onSaveRecipe && onSaveRecipe(parsed.data)}
              />
           );
        } else if (parsed.type === "weekly_plan" && parsed.data) {
           const isSavedPlan = savedPlans.some(p => p.prepDay === parsed.data.prepDay && JSON.stringify(p.schedule) === JSON.stringify(parsed.data.schedule));
           return <WeeklyPlanCard 
              plan={parsed.data} 
              isSaved={isSavedPlan} 
              onToggleSave={() => onSavePlan && onSavePlan(parsed.data)} 
           />;
        }
      } catch (e) {
        // Not JSON
      }

      return (
        <div className="markdown-body prose prose-slate prose-sm sm:prose-base dark:prose-invert max-w-none break-words overflow-x-auto prose-p:leading-relaxed prose-li:my-0.5 text-black dark:text-gray-200 prose-p:text-black dark:prose-p:text-gray-200 prose-headings:text-black dark:prose-headings:text-gray-100 prose-strong:text-black dark:prose-strong:text-white">
          <Markdown>{content}</Markdown>
        </div>
      );
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      const matchIndex = match.index!;
      
      // Text before JSON block
      if (matchIndex > lastIndex) {
        const textBefore = content.substring(lastIndex, matchIndex);
        if (textBefore.trim()) {
           segments.push(
             <div key={`md-${idx}`} className="markdown-body prose prose-slate prose-sm sm:prose-base dark:prose-invert max-w-none break-words overflow-x-auto prose-p:leading-relaxed prose-li:my-0.5 text-black dark:text-gray-200 prose-p:text-black dark:prose-p:text-gray-200 prose-headings:text-black dark:prose-headings:text-gray-100 prose-strong:text-black dark:prose-strong:text-white">
               <Markdown>{textBefore}</Markdown>
             </div>
           );
        }
      }

      // Try to parse JSON
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed.type === "recipe" && parsed.data) {
          const isSaved = savedRecipes.some(r => r.title === parsed.data.title);
          segments.push(
            <RecipeCard 
              key={`recipe-${idx}`} 
              recipe={parsed.data} 
              isSaved={isSaved}
              onToggleSave={() => onSaveRecipe && onSaveRecipe(parsed.data)}
            />
          );
        } else if (parsed.type === "weekly_plan" && parsed.data) {
          const isSavedPlan = savedPlans.some(p => p.prepDay === parsed.data.prepDay && JSON.stringify(p.schedule) === JSON.stringify(parsed.data.schedule));
          segments.push(
            <WeeklyPlanCard 
              key={`weekly-${idx}`} 
              plan={parsed.data} 
              isSaved={isSavedPlan} 
              onToggleSave={() => onSavePlan && onSavePlan(parsed.data)} 
            />
          );
        } else {
          // If not our specific format, render as normal code block
          segments.push(
             <div key={`md-json-${idx}`} className="markdown-body prose prose-slate prose-sm sm:prose-base dark:prose-invert max-w-none break-words overflow-x-auto">
               <Markdown>{match[0]}</Markdown>
             </div>
          );
        }
      } catch {
        // If JSON fails to parse, render as normal text code block
        segments.push(
           <div key={`md-fail-${idx}`} className="markdown-body prose prose-slate prose-sm sm:prose-base dark:prose-invert max-w-none break-words overflow-x-auto">
             <Markdown>{match[0]}</Markdown>
           </div>
        );
      }

      lastIndex = matchIndex + match[0].length;
    });

    // Text after JSON blocks
    if (lastIndex < content.length) {
      const textAfter = content.substring(lastIndex);
      if (textAfter.trim()) {
        segments.push(
          <div key={`md-last`} className="markdown-body prose prose-slate prose-sm sm:prose-base dark:prose-invert max-w-none break-words overflow-x-auto prose-p:leading-relaxed prose-li:my-0.5 text-black dark:text-gray-200 prose-p:text-black dark:prose-p:text-gray-200 prose-headings:text-black dark:prose-headings:text-gray-100 prose-strong:text-black dark:prose-strong:text-white">
            <Markdown>{textAfter}</Markdown>
          </div>
        );
      }
    }

    return <>{segments}</>;
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 shrink-0 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-sm font-bold mr-3 mt-1 shadow-sm">
          🍱
        </div>
      )}
      <div
        className={cn(
          "rounded-[24px] px-3 py-3 sm:px-5 sm:py-4 shadow-sm text-sm sm:text-base selection:bg-emerald-500/30 transition-colors duration-300 min-w-0 w-full",
          isUser
            ? "max-w-[95%] sm:max-w-[80%] bg-emerald-600 text-white rounded-tr-sm"
            : "max-w-[calc(100%-36px)] sm:max-w-[80%] bg-[#F9FAFB] dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-sm border border-gray-100 dark:border-gray-700"
        )}
      >
        {isUser ? (
          <div className="flex flex-col gap-2">
            {message.imageBase64 && (
               <img 
                 src={message.imageBase64.startsWith('data:') ? message.imageBase64 : `data:image/jpeg;base64,${message.imageBase64}`} 
                 alt="Uploaded ingredient" 
                 className="w-full max-w-[240px] rounded-xl object-cover border-2 border-emerald-400"
               />
            )}
            <div className="whitespace-pre-wrap font-medium">{message.content}</div>
          </div>
        ) : (
          renderContent(message.content)
        )}
        <div
          className={cn(
            "text-[10px] mt-2 font-bold tracking-wider text-right uppercase",
            isUser ? "text-emerald-200" : "text-gray-400 dark:text-gray-500"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
