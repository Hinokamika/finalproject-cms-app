import HabitsTable from "@/lib/components/tables/HabitsTable";

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-gray-900">Habits</h1>
        <p className="text-gray-600 mt-1">Track and manage all user habits</p>
      </div>
      <HabitsTable />
    </div>
  );
}
