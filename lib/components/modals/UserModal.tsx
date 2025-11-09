"use client";
import { Modal, Form, Input, InputNumber, Select, Button, notification } from "antd";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues?: any;
  onSuccess?: () => void;
};

export default function UserModal({ open, onClose, initialValues, onSuccess }: Props) {
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
      const res = await fetch(isEdit ? `/api/users/${initialValues.id}` : "/api/users", {
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
      title={isEdit ? "Edit User" : "Add User"}
      footer={
        <div className="flex gap-2 justify-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>{isEdit ? "Update" : "Create"}</Button>
        </div>
      }
      destroyOnHidden
      maskClosable={false}
    >
      <Form layout="vertical" form={form} initialValues={{ gender: null, activity_level: null, diet_type: null }}>
        <Form.Item name="user_id" label="User ID (auth.users UUID)">
          <Input placeholder="uuid" />
        </Form.Item>
        <Form.Item name="user_name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="age" label="Age">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Select allowClear options={[{ value: "male" }, { value: "female" }, { value: "other" }]} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="height" label="Height (cm)">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="weight" label="Weight (kg)">
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="activity_level" label="Activity Level">
            <Select allowClear options={["sedentary","light","moderate","active","very_active"].map(v=>({value:v}))} />
          </Form.Item>
          <Form.Item name="diet_type" label="Diet Type">
            <Select allowClear options={["balanced","keto","vegan","vegetarian","paleo"].map(v=>({value:v}))} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="calories" label="Calories">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="protein" label="Protein (g)">
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="carbs" label="Carbs (g)">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="fat" label="Fat (g)">
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
        <Form.Item name="sugar" label="Sugar (g)">
          <InputNumber className="w-full" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="exercise_id" label="Workout Plan ID">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="relax_id" label="Relax Plan ID">
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
