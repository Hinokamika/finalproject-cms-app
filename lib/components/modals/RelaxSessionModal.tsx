"use client";
import { Modal, Form, Input, InputNumber, DatePicker, Button, notification } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import UserSelect from "@/lib/components/controls/UserSelect";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues?: any;
  onSuccess?: () => void;
};

export default function RelaxSessionModal({ open, onClose, initialValues, onSuccess }: Props) {
  const [form] = Form.useForm();
  const isEdit = Boolean(initialValues?.id);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          started_at: initialValues.started_at ? dayjs(initialValues.started_at) : null,
        });
      }
    }
  }, [open, form, initialValues]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      started_at: values.started_at ? values.started_at.toISOString() : null,
    };
    try {
      const res = await fetch(isEdit ? `/api/relax-sessions/${initialValues.id}` : "/api/relax-sessions", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      notification.success({ message: isEdit ? "Updated" : "Created" });
      onClose();
      onSuccess?.();
    } catch (e: any) {
      notification.error({ message: e.message || "Save failed" });
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={isEdit ? "Edit Relax Session" : "Add Relax Session"}
      footer={
        <div className="flex gap-2 justify-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>{isEdit ? "Update" : "Create"}</Button>
        </div>
      }
      destroyOnHidden
      maskClosable={false}
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="user_id" label="User">
          <UserSelect />
        </Form.Item>
        <Form.Item name="started_at" label="Started At"><DatePicker showTime className="w-full" /></Form.Item>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="minutes" label="Minutes"><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="pattern" label="Pattern"><Input /></Form.Item>
        </div>
        <Form.Item name="mood" label="Mood"><Input /></Form.Item>
      </Form>
    </Modal>
  );
}

