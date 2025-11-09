"use server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/client";

export type AuthUser = {
  id: string;
  email: string | null;
};

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  if (!accessToken) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}

export async function assertAdmin(): Promise<AuthUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);
  if (admins.length > 0) {
    const email = user.email ?? "";
    if (!admins.includes(email)) throw new Error("FORBIDDEN");
  }
  return user;
}

