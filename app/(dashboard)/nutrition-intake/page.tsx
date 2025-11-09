import NutritionIntakeTable from "@/lib/components/tables/NutritionIntakeTable";

export default function NutritionIntakePage() {
  return (
    <div className="space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-gray-900">Nutrition Intake</h1>
        <p className="text-gray-600 mt-1">Track user nutrition intake</p>
      </div>
      <NutritionIntakeTable />
    </div>
  );
}
