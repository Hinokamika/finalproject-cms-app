import NutritionGoalsTable from "@/lib/components/tables/NutritionGoalsTable";

export default function NutritionGoalsPage() {
  return (
    <div className="space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-gray-900">Nutrition Goals</h1>
        <p className="text-gray-600 mt-1">Manage nutrition goals for users</p>
      </div>
      <NutritionGoalsTable />
    </div>
  );
}
