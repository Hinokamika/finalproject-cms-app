"use client";
import { Modal, Form, Input, Select, Button, notification } from "antd";
import UserSelect from "@/lib/components/controls/UserSelect";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues?: any;
  onSuccess?: () => void;
};

export default function RelaxPlanModal({ open, onClose, initialValues, onSuccess }: Props) {
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
      const res = await fetch(isEdit ? `/api/relax-plans/${initialValues.id}` : "/api/relax-plans", {
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
      title={isEdit ? "Edit Relax Plan" : "Add Relax Plan"}
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
        <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="description" label="Description"><Input.TextArea rows={3} /></Form.Item>
        <Form.Item name="relaxation_type" label="Type"><Select allowClear options={["breathing","meditation","yoga","other"].map(v=>({value:v}))} /></Form.Item>
        <Form.Item name="day" label="Day"><Input /></Form.Item>
      </Form>
    </Modal>
  );
}
