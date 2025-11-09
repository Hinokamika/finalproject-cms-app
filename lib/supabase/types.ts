export type UserIdentity = {
  id: number;
  user_id: string | null;
  user_name: string | null;
  email: string | null;
  phone: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  activity_level: string | null;
  diet_type: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  sugar: number | null;
  exercise_id: number | null;
  relax_id: number | null;
  created_at: string;
};

export type WorkoutPlan = {
  id: number;
  user_id: string | null;
  exercise_name: string | null;
  description: string | null;
  difficulty_level: string | null;
  exercise_category: string | null;
  duration_minutes: number | null;
  repetitions: string | null;
  day: string | null;
  finished: boolean | null;
  created_at: string;
};

export type RelaxPlan = {
  id: number;
  user_id: string | null;
  title: string | null;
  description: string | null;
  relaxation_type: string | null;
  day: string | null;
  created_at: string;
};

export type Meal = {
  name: string;
  calories?: number;
  items?: string[];
  description?: string;
};

export type MealPlan = {
  id: number;
  user_id: string | null;
  day_index: number | null;
  day_label: string | null;
  meals: Meal[] | null;
  snacks: string[] | null;
  created_at: string;
};

export type NutritionIntake = {
  id: number;
  user_id: string | null;
  bucket_date: string; // YYYY-MM-DD
  energy_kcal: number | null;
  carbs_g: number | null;
  protein_g: number | null;
  fat_g: number | null;
  sugar_g: number | null;
  source: string | null;
  metadata: unknown | null; // jsonb
  created_at: string;
};

export type NutritionGoalHistory = {
  id: number;
  user_id: string | null;
  goal: string | null; // lose/maintain/gain
  delta_percent: number | null; // 10/15/20
  calories_target: number | null;
  carbs_g: number | null;
  protein_g: number | null;
  fat_g: number | null;
  sugar_g: number | null;
  created_at: string;
};

export type Habit = {
  id: number;
  user_id: string | null;
  bucket_date: string; // YYYY-MM-DD
  steps: number | null;
  calories: number | null;
  standing_minutes: number | null;
  sleep_hours: number | null; // numeric(4,1)
  heart_rate_avg: number | null;
  sleep_start_time: string | null; // HH:mm:ss
  created_at: string;
};

export type RelaxSession = {
  id: number;
  user_id: string | null;
  started_at: string; // ISO timestamptz
  minutes: number | null;
  pattern: string | null;
  mood: string | null;
  created_at: string;
};

export type Message = {
  id: number;
  user_id: string | null;
  role: string | null; // user/assistant
  content: string | null;
  created_at: string;
};

