import RelaxPlansTable from "@/lib/components/tables/RelaxPlansTable";

export default function RelaxPlansPage() {
  return (
    <div className="space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-gray-900">Relax Plans</h1>
        <p className="text-gray-600 mt-1">Create and manage relaxation plans</p>
      </div>
      <RelaxPlansTable />
    </div>
  );
}
