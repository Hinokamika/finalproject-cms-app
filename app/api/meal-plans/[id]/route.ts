import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";
import { assertAdmin } from "@/lib/auth/guard";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await assertAdmin();
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from("meal_plan")
      .update(body)
      .eq("id", Number(params.id))
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: e?.message || "Failed to update" }, { status });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await assertAdmin();
    const { error } = await supabaseAdmin.from("meal_plan").delete().eq("id", Number(params.id));
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: e?.message || "Failed to delete" }, { status });
  }
}

