import RelaxSessionsTable from "@/lib/components/tables/RelaxSessionsTable";

export default function RelaxSessionsPage() {
  return (
    <div className="space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-gray-900">Relax Sessions</h1>
        <p className="text-gray-600 mt-1">Monitor all relaxation sessions</p>
      </div>
      <RelaxSessionsTable />
    </div>
  );
}
