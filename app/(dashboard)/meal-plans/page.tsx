import MealPlansTable from "@/lib/components/tables/MealPlansTable";

export default function MealPlansPage() {
  return (
    <div className="space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-gray-900">Meal Plans</h1>
        <p className="text-gray-600 mt-1">Create and manage meal plans</p>
      </div>
      <MealPlansTable />
    </div>
  );
}
