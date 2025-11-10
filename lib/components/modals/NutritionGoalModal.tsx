"use client";
import { Modal, Form, Input, InputNumber, Select, Button, notification } from "antd";
import UserSelect from "@/lib/components/controls/UserSelect";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues?: any;
  onSuccess?: () => void;
};

export default function NutritionGoalModal({ open, onClose, initialValues, onSuccess }: Props) {
  const [form] = Form.useForm();
  const isEdit = Boolean(initialValues?.id);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) form.setFieldsValue(initialValues);
    }
  }, [open, form, initialValues]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      const res = await fetch(isEdit ? `/api/nutrition-goals/${initialValues.id}` : "/api/nutrition-goals", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
      title={isEdit ? "Edit Nutrition Goal" : "Add Nutrition Goal"}
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
        <Form.Item name="goal" label="Goal"><Select allowClear options={["lose","maintain","gain"].map(v=>({value:v}))} /></Form.Item>
        <Form.Item name="delta_percent" label="Delta %"><InputNumber className="w-full" /></Form.Item>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="calories_target" label="Calories Target"><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="carbs_g" label="Carbs (g)"><InputNumber className="w-full" /></Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="protein_g" label="Protein (g)"><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="fat_g" label="Fat (g)"><InputNumber className="w-full" /></Form.Item>
        </div>
        <Form.Item name="sugar_g" label="Sugar (g)"><InputNumber className="w-full" /></Form.Item>
      </Form>
    </Modal>
  );
}
