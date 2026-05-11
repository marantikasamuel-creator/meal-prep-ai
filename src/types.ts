export interface UserProfile {
  goal: "diet" | "bulking" | "maintain" | "";
  calories_target: number;
  allergies: string[];
  daily_budget_idr: number;
  taste_preferences: string[];
  disliked_foods: string[];
  mood?: string;
  activity_level: "sedentary" | "light" | "moderate" | "active" | "very_active" | "";
  cooking_skill: "beginner" | "intermediate" | "advanced" | "";
  available_time_minutes: number;
}

export interface ChatMessageData {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}
