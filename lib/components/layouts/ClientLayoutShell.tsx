"use client";
import { Layout } from "antd";
import Sidebar from "@/lib/components/layouts/Sidebar";
import HeaderBar from "@/lib/components/layouts/Header";

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Layout.Content style={{ padding: 24, background: "#f7f8fa" }}>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}

