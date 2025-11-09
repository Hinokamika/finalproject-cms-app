import WorkoutPlansTable from "@/lib/components/tables/WorkoutPlansTable";

export default function WorkoutPlansPage() {
  return (
    <div className="space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-gray-900">Workout Plans</h1>
        <p className="text-gray-600 mt-1">View and manage all workout plans</p>
      </div>
      <WorkoutPlansTable />
    </div>
  );
}
