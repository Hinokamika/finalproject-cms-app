"use client";
import { Select, Spin } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

type Option = { label: string; value: string };

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default function UserSelect({
  value,
  onChange,
  placeholder = "Select user",
  allowClear = true,
  style,
  className,
}: {
  value?: string | null;
  onChange?: (val?: string) => void;
  placeholder?: string;
  allowClear?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debounced = useDebounced(search, 300);
  const initialized = useRef(false);

  async function fetchUsers(q?: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("page_size", "50");
      if (q) params.set("search", q);
      const res = await fetch(`/api/users?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load users");
      const opts: Option[] = (json.data || []).map((u: any) => ({
        value: u.user_id || "",
        label: u.user_name || u.email || u.user_id || "",
      })).filter((o: Option) => Boolean(o.value));
      setOptions(opts);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }

  // Load initial options
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchUsers();
    }
  }, []);

  // Update on search
  useEffect(() => {
    fetchUsers(debounced || undefined);
  }, [debounced]);

  // Ensure the current value appears in options for display
  useEffect(() => {
    if (!value) return;
    const exists = options.some((o) => o.value === value);
    if (exists) return;
    (async () => {
      try {
        const res = await fetch(`/api/users?ids=${encodeURIComponent(value)}&page_size=1`);
        const json = await res.json();
        if (!res.ok) return;
        const u = (json.data || [])[0];
        if (u?.user_id) {
          setOptions((prev) => [{ value: u.user_id, label: u.user_name || u.email || u.user_id }, ...prev]);
        }
      } catch {
        // ignore
      }
    })();
  }, [value]);

  return (
    <Select
      showSearch
      allowClear={allowClear}
      placeholder={placeholder}
      filterOption={false}
      onSearch={setSearch}
      options={options}
      value={value || undefined}
      onChange={(v) => onChange?.(v)}
      notFoundContent={loading ? <Spin size="small" /> : null}
      style={style}
      className={className}
    />
  );
}

