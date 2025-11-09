"use client";
import { useEffect, useMemo, useState } from "react";

export default function useUserNames(userIds: Array<string | null | undefined>) {
  const [map, setMap] = useState<Record<string, string>>({});

  const ids = useMemo(() => {
    const uniq = Array.from(new Set((userIds || []).filter(Boolean) as string[]));
    return uniq;
  }, [userIds]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!ids.length) { setMap({}); return; }
      try {
        const qs = new URLSearchParams({ ids: ids.join(","), page_size: String(Math.max(100, ids.length)) });
        const res = await fetch(`/api/users?${qs.toString()}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load users");
        const m: Record<string, string> = {};
        (json.data || []).forEach((u: any) => {
          if (u?.user_id) m[u.user_id] = u.user_name || u.email || u.user_id;
        });
        if (!cancelled) setMap(m);
      } catch {
        // ignore
      }
    }
    run();
    return () => { cancelled = true; };
  }, [ids.join(",")]);

  return map;
}

