import UsersTable from "@/lib/components/tables/UsersTable";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-1">Manage all users in the system</p>
      </div>
      <UsersTable />
    </div>
  );
}
