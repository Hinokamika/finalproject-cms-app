"use client";
import { Table, Space, Popconfirm, Tooltip, Button, Input, DatePicker, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import HabitModal from "@/lib/components/modals/HabitModal";
import dayjs from "dayjs";
import useUserNames from "@/lib/components/hooks/useUserNames";

type Rec = any;

export default function HabitsTable() {
  const [data, setData] = useState<Rec[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Rec | undefined>(undefined);
  const [filters, setFilters] = useState<{ start_date?: string; end_date?: string; user_id?: string }>({});

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("page_size", String(pageSize));
    if (filters.start_date) params.set("start_date", filters.start_date);
    if (filters.end_date) params.set("end_date", filters.end_date);
    if (filters.user_id) params.set("user_id", filters.user_id);
    return params.toString();
  }, [page, pageSize, filters]);

  const userMap = useUserNames(data.map((d) => d.user_id));

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/habits?${queryString}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setData(json.data || []);
      setCount(json.count || 0);
    } catch (e: any) {
      notification.error({ message: e.message || "Failed to load" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [queryString]);

  const onDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      notification.success({ message: "Deleted" });
      load();
    } catch (e: any) {
      notification.error({ message: e.message || "Delete failed" });
    }
  };

  const onBulkDelete = async () => {
    try {
      const res = await fetch(`/api/habits/bulk`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: selectedRowKeys }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Bulk delete failed");
      notification.success({ message: "Deleted selected" });
      setSelectedRowKeys([]);
      load();
    } catch (e: any) {
      notification.error({ message: e.message || "Bulk delete failed" });
    }
  };

  const columns: ColumnsType<Rec> = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "User", dataIndex: "user_id", width: 220, render: (v) => (v ? (userMap[v] || v) : "") },
    { title: "Date", dataIndex: "bucket_date", width: 140 },
    { title: "Steps", dataIndex: "steps", width: 100 },
    { title: "Calories", dataIndex: "calories", width: 110 },
    { title: "Sleep (h)", dataIndex: "sleep_hours", width: 110 },
    { title: "HR Avg", dataIndex: "heart_rate_avg", width: 110 },
    { title: "Created", dataIndex: "created_at", render: (v) => dayjs(v).format("YYYY-MM-DD HH:mm"), width: 180 },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => { setEditing(record); setModalOpen(true); }} />
          </Tooltip>
          <Popconfirm title="Delete this item?" onConfirm={() => onDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="flex gap-2 items-center flex-wrap">
          <Input placeholder="User ID" allowClear style={{ width: 220 }} onChange={(e)=> setFilters((f)=>({ ...f, user_id: e.target.value || undefined }))} />
          <DatePicker.RangePicker onChange={(values) => {
            if (!values) { setFilters((f)=> ({ ...f, start_date: undefined, end_date: undefined })); return; }
            setFilters((f)=> ({ ...f, start_date: values[0]?.format("YYYY-MM-DD"), end_date: values[1]?.format("YYYY-MM-DD") }));
          }} />
          <Button icon={<ReloadOutlined />} onClick={load} />
        </div>
        <div className="flex gap-2">
          {selectedRowKeys.length > 0 && (
            <Popconfirm title={`Delete ${selectedRowKeys.length} selected?`} onConfirm={onBulkDelete}>
              <Button danger>Delete Selected</Button>
            </Popconfirm>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(undefined); setModalOpen(true); }}>
            Add New
          </Button>
        </div>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{ current: page, pageSize, total: count, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        scroll={{ x: 1000 }}
      />

      <HabitModal open={modalOpen} onClose={() => setModalOpen(false)} initialValues={editing} onSuccess={load} />
    </div>
  );
}
