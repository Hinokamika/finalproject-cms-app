import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";
import { parsePagination, sanitizeLike } from "@/lib/utils/helpers";
import { assertAdmin } from "@/lib/auth/guard";

export async function GET(req: Request) {
  try {
    await assertAdmin();
    const { searchParams } = new URL(req.url);
    const { from, to } = parsePagination(searchParams);
    const search = searchParams.get("search");
    const idsParam = searchParams.get("ids");
    const userId = searchParams.get("user_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    let query = supabaseAdmin
      .from("user_identity")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("created_at", { ascending: false });

    if (userId) query = query.eq("user_id", userId);
    if (idsParam) {
      const ids = idsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (ids.length) query = query.in("user_id", ids);
    }
    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate);
    if (search) {
      const term = `%${sanitizeLike(search)}%`;
      query = query.or(
        `user_name.ilike.${term},email.ilike.${term},phone.ilike.${term}`
      );
    }

    console.log("API /api/users params:", {
      from,
      to,
      search,
      idsParam,
      userId,
      startDate,
      endDate,
    });

    const { data, error, count } = await query;
    console.log("API /api/users result:", {
      dataLength: data?.length,
      count,
      error,
    });
    if (error) throw error;
    return NextResponse.json({ data, count });
  } catch (e: any) {
    const status =
      e?.message === "UNAUTHORIZED"
        ? 401
        : e?.message === "FORBIDDEN"
        ? 403
        : 500;
    return NextResponse.json(
      { error: e?.message || "Failed to fetch" },
      { status }
    );
  }
}

export async function POST(req: Request) {
  try {
    await assertAdmin();
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from("user_identity")
      .insert(body)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (e: any) {
    const status =
      e?.message === "UNAUTHORIZED"
        ? 401
        : e?.message === "FORBIDDEN"
        ? 403
        : 500;
    return NextResponse.json(
      { error: e?.message || "Failed to create" },
      { status }
    );
  }
}
