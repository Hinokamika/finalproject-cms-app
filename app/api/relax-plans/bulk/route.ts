import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";
import { assertAdmin } from "@/lib/auth/guard";

export async function DELETE(req: Request) {
  try {
    await assertAdmin();
    const { ids } = await req.json();
    if (!Array.isArray(ids) || !ids.length) {
      return NextResponse.json({ error: "ids is required" }, { status: 400 });
    }
    const { error } = await supabaseAdmin.from("relax_plan").delete().in("id", ids.map(Number));
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: e?.message || "Failed to bulk delete" }, { status });
  }
}

