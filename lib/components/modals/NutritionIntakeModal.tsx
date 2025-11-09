"use client";
import { Modal, Form, Input, InputNumber, DatePicker, Button, notification } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues?: any;
  onSuccess?: () => void;
};

export default function NutritionIntakeModal({ open, onClose, initialValues, onSuccess }: Props) {
  const [form] = Form.useForm();
  const isEdit = Boolean(initialValues?.id);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) {
        const { bucket_date, ...rest } = initialValues;
        form.setFieldsValue({ ...rest, bucket_date: bucket_date ? dayjs(bucket_date) : null });
      }
    }
  }, [open, form, initialValues]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = { ...values, bucket_date: values.bucket_date ? values.bucket_date.format("YYYY-MM-DD") : null };
    try {
      const res = await fetch(isEdit ? `/api/nutrition-intake/${initialValues.id}` : "/api/nutrition-intake", {
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
      title={isEdit ? "Edit Nutrition Intake" : "Add Nutrition Intake"}
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
        <Form.Item name="user_id" label="User ID (UUID)"><Input /></Form.Item>
        <Form.Item name="bucket_date" label="Date"><DatePicker className="w-full" /></Form.Item>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="energy_kcal" label="Energy (kcal)"><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="carbs_g" label="Carbs (g)"><InputNumber className="w-full" /></Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="protein_g" label="Protein (g)"><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="fat_g" label="Fat (g)"><InputNumber className="w-full" /></Form.Item>
        </div>
        <Form.Item name="sugar_g" label="Sugar (g)"><InputNumber className="w-full" /></Form.Item>
        <Form.Item name="source" label="Source"><Input /></Form.Item>
        <Form.Item label="Metadata (JSON, read-only)">
          <pre className="bg-gray-50 p-3 rounded border overflow-auto max-h-52 text-xs">
            {initialValues?.metadata ? JSON.stringify(initialValues.metadata, null, 2) : "{}"}
          </pre>
        </Form.Item>
      </Form>
    </Modal>
  );
}
