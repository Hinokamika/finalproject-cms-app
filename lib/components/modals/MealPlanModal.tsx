"use client";
import { Modal, Form, Input, InputNumber, Button, notification } from "antd";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues?: any;
  onSuccess?: () => void;
};

export default function MealPlanModal({ open, onClose, initialValues, onSuccess }: Props) {
  const [form] = Form.useForm();
  const isEdit = Boolean(initialValues?.id);
  const [mealsText, setMealsText] = useState("[]");
  const [snacksText, setSnacksText] = useState("[]");
  const [validMeals, setValidMeals] = useState(true);
  const [validSnacks, setValidSnacks] = useState(true);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({ ...initialValues });
        setMealsText(JSON.stringify(initialValues.meals ?? [], null, 2));
        setSnacksText(JSON.stringify(initialValues.snacks ?? [], null, 2));
      } else {
        setMealsText("[]");
        setSnacksText("[]");
      }
    }
  }, [open, form, initialValues]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      let meals: any = [];
      let snacks: any = [];
      try { meals = JSON.parse(mealsText || "[]"); setValidMeals(true); } catch { setValidMeals(false); throw new Error("Invalid meals JSON"); }
      try { snacks = JSON.parse(snacksText || "[]"); setValidSnacks(true); } catch { setValidSnacks(false); throw new Error("Invalid snacks JSON"); }

      const payload = { ...values, meals, snacks };
      const res = await fetch(isEdit ? `/api/meal-plans/${initialValues.id}` : "/api/meal-plans", {
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
      title={isEdit ? "Edit Meal Plan" : "Add Meal Plan"}
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
        <div className="grid grid-cols-2 gap-3">
          <Form.Item name="day_index" label="Day Index"><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="day_label" label="Day Label"><Input /></Form.Item>
        </div>
        <Form.Item label="Meals (JSON)" validateStatus={validMeals ? undefined : "error"} help={validMeals ? undefined : "Invalid JSON"}>
          <Input.TextArea value={mealsText} onChange={(e)=>setMealsText(e.target.value)} rows={8} spellCheck={false} />
        </Form.Item>
        <Form.Item label="Snacks (JSON Array)" validateStatus={validSnacks ? undefined : "error"} help={validSnacks ? undefined : "Invalid JSON"}>
          <Input.TextArea value={snacksText} onChange={(e)=>setSnacksText(e.target.value)} rows={6} spellCheck={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
