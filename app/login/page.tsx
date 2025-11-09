/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Form, Input, Button, Card, Typography, notification } from "antd";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      notification.success({ message: "Logged in" });
      const redirect = params.get("redirect") || "/";
      router.replace(redirect);
    } catch (e: any) {
      notification.error({ message: e.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <Typography.Title
          level={2}
          style={{ marginBottom: 32, textAlign: "center", marginTop: 0 }}
        >
          Admin Login
        </Typography.Title>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
            style={{ marginBottom: 20 }}
          >
            <Input placeholder="you@example.com" size="large" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
            style={{ marginBottom: 24 }}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
}
