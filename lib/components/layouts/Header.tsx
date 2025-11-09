"use client";
import { Layout, Typography } from "antd";
import { usePathname } from "next/navigation";

const { Header } = Layout;

function titleFromPath(path: string) {
  if (path === "/") return "Dashboard";
  const t = path.replace(/^\//, "").split("?")[0].split("#")[0];
  return t
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function HeaderBar() {
  const pathname = usePathname();
  return (
    <Header style={{ background: "#fff", padding: "0 16px", borderBottom: "1px solid #f0f0f0" }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {titleFromPath(pathname)}
      </Typography.Title>
    </Header>
  );
}

