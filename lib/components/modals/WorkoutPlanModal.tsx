/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Modal, Form, Input, InputNumber, Select, Switch, Button, notification } from "antd";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues?: any;
  onSuccess?: () => void;
};

export default function WorkoutPlanModal({ open, onClose, initialValues, onSuccess }: Props) {
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
      const res = await fetch(isEdit ? `/api/workout-plans/${initialValues.id}` : "/api/workout-plans", {
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
      title={isEdit ? "Edit Workout Plan" : "Add Workout Plan"}
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
        <Form.Item name="user_id" label="User ID (UUID)"><Input /></Form.Item>
        <Form.Item name="exercise_name" label="Exercise Name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="description" label="Description"><Input.TextArea rows={3} /></Form.Item>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="difficulty_level" label="Difficulty"><Select allowClear options={["easy","medium","hard"].map(v=>({value:v}))} /></Form.Item>
          <Form.Item name="exercise_category" label="Category"><Input /></Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="duration_minutes" label="Duration (min)"><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="repetitions" label="Repetitions"><Input /></Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="day" label="Day"><Input /></Form.Item>
          <Form.Item name="finished" label="Finished" valuePropName="checked"><Switch /></Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
