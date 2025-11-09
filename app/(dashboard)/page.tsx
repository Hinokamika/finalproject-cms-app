import { supabaseAdmin } from "@/lib/supabase/client";
import { assertAdmin } from "@/lib/auth/guard";
import DashboardStats from "@/lib/components/dashboard/DashboardStats";

async function getCounts() {
  const tables = [
    "user_identity",
    "workout_plan",
    "meal_plan",
    "messages",
  ] as const;
  const results = await Promise.all(
    tables.map((t) =>
      supabaseAdmin.from(t).select("id", { count: "exact", head: true })
    )
  );
  const [users, workouts, meals, messages] = results.map((r) => r.count || 0);

  // Active users today: messages created today
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const { count: activeToday } = await supabaseAdmin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .gte("created_at", start.toISOString());

  return { users, workouts, meals, activeToday: activeToday || 0, messages };
}

export default async function DashboardHome() {
  await assertAdmin();
  const { users, workouts, meals, activeToday, messages } = await getCounts();
  return (
    <div className="space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
      </div>
      <DashboardStats
        users={users}
        workouts={workouts}
        meals={meals}
        activeToday={activeToday}
        messages={messages}
      />
    </div>
  );
}
