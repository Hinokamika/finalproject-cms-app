import { assertAdmin } from "@/lib/auth/guard";
import { redirect } from "next/navigation";
import ClientLayoutShell from "@/lib/components/layouts/ClientLayoutShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Enforce admin access for all dashboard pages
  try {
    await assertAdmin();
  } catch {
    redirect("/login");
  }
  return <ClientLayoutShell>{children}</ClientLayoutShell>;
}
