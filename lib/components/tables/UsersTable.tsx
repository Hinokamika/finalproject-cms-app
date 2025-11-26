/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Table,
  Tag,
  Space,
  Popconfirm,
  Tooltip,
  Button,
  Input,
  DatePicker,
  notification,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import UserModal from "@/lib/components/modals/UserModal";
import dayjs from "dayjs";

type UserRecord = any;

type Filters = {
  search?: string;
  start_date?: string;
  end_date?: string;
};

export default function UsersTable() {
  const [data, setData] = useState<UserRecord[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserRecord | undefined>(undefined);
  const [filters, setFilters] = useState<Filters>({});

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("page_size", String(pageSize));
    if (filters.search) params.set("search", filters.search);
    if (filters.start_date) params.set("start_date", filters.start_date);
    if (filters.end_date) params.set("end_date", filters.end_date);
    return params.toString();
  }, [page, pageSize, filters]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?${queryString}`);
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

  useEffect(() => {
    load();
  }, [queryString]);

  useEffect(() => {
    console.log("UsersTable data:", data);
    console.log("UsersTable count:", count);
  }, [data, count]);

  const onDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
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
      const res = await fetch(`/api/users/bulk`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedRowKeys }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Bulk delete failed");
      notification.success({ message: "Deleted selected" });
      setSelectedRowKeys([]);
      load();
    } catch (e: any) {
      notification.error({ message: e.message || "Bulk delete failed" });
    }
  };

  const columns: ColumnsType<UserRecord> = [
    { title: "ID", dataIndex: "id", sorter: true, width: 90 },
    { title: "Name", dataIndex: "user_name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Activity",
      dataIndex: "activity_level",
      render: (v) => (v ? <Tag color="blue">{v}</Tag> : null),
    },
    { title: "Calories", dataIndex: "calories", width: 100 },
    {
      title: "Created",
      dataIndex: "created_at",
      render: (v) => dayjs(v).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(record);
                setModalOpen(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex gap-3 items-center flex-wrap">
          <Space.Compact>
            <Input
              allowClear
              placeholder="Search name/email/phone"
              style={{ width: 240 }}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  search: e.target.value || undefined,
                }))
              }
              onPressEnter={(e) => {
                setPage(1);
                setFilters((f) => ({
                  ...f,
                  search: (e.target as HTMLInputElement).value || undefined,
                }));
              }}
            />
            <Button icon={<SearchOutlined />} onClick={() => setPage(1)}>
              Search
            </Button>
          </Space.Compact>
          <DatePicker.RangePicker
            onChange={(values) => {
              if (!values) {
                setFilters((f) => ({
                  ...f,
                  start_date: undefined,
                  end_date: undefined,
                }));
                return;
              }
              setFilters((f) => ({
                ...f,
                start_date: values[0]?.toISOString(),
                end_date: values[1]?.toISOString(),
              }));
            }}
          />
          <Button icon={<ReloadOutlined />} onClick={load} />
        </div>
        <div className="flex gap-3">
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`Delete ${selectedRowKeys.length} selected?`}
              onConfirm={onBulkDelete}
            >
              <Button danger>Delete Selected</Button>
            </Popconfirm>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(undefined);
              setModalOpen(true);
            }}
          >
            Add New
          </Button>
        </div>
      </div>

      <div className="overflow-auto">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={{
            current: page,
            pageSize,
            total: count,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          scroll={{ x: 900 }}
        />
      </div>

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialValues={editing}
        onSuccess={load}
      />
    </div>
  );
}
