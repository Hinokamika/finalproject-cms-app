"use client";
import { Modal, Form, Input, InputNumber, DatePicker, TimePicker, Button, notification } from "antd";
import UserSelect from "@/lib/components/controls/UserSelect";
import { useEffect } from "react";
import dayjs from "dayjs";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues?: any;
  onSuccess?: () => void;
};

export default function HabitModal({ open, onClose, initialValues, onSuccess }: Props) {
  const [form] = Form.useForm();
  const isEdit = Boolean(initialValues?.id);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          bucket_date: initialValues.bucket_date ? dayjs(initialValues.bucket_date) : null,
          sleep_start_time: initialValues.sleep_start_time ? dayjs(initialValues.sleep_start_time, "HH:mm:ss") : null,
        });
      }
    }
  }, [open, form, initialValues]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      bucket_date: values.bucket_date ? values.bucket_date.format("YYYY-MM-DD") : null,
      sleep_start_time: values.sleep_start_time ? values.sleep_start_time.format("HH:mm:ss") : null,
    };
    try {
      const res = await fetch(isEdit ? `/api/habits/${initialValues.id}` : "/api/habits", {
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
      title={isEdit ? "Edit Habit" : "Add Habit"}
      footer={
        <div className="flex gap-2 justify-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>{isEdit ? "Update" : "Create"}</Button>
        </div>
      }
      destroyOnHidden
      maskClosable={false}
      width={720}
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="user_id" label="User">
          <UserSelect />
        </Form.Item>
        <Form.Item name="bucket_date" label="Date"><DatePicker className="w-full" /></Form.Item>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="steps" label="Steps"><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="calories" label="Calories"><InputNumber className="w-full" /></Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="standing_minutes" label="Standing (min)"><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="sleep_hours" label="Sleep (hours)"><InputNumber className="w-full" step={0.1} /></Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="heart_rate_avg" label="Heart Rate Avg"><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="sleep_start_time" label="Sleep Start Time"><TimePicker className="w-full" format="HH:mm:ss" /></Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
