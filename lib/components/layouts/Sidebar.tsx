"use client";
import { Layout, Menu, Button } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  FireOutlined,
  SmileOutlined,
  CoffeeOutlined,
  FundOutlined,
  AimOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useCallback } from "react";

const { Sider } = Layout;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const items = useMemo(
    () => [
      { key: "/", icon: <HomeOutlined />, label: "Dashboard" },
      { key: "/users", icon: <UserOutlined />, label: "Users" },
      { key: "/workout-plans", icon: <FireOutlined />, label: "Workout Plans" },
      { key: "/relax-plans", icon: <SmileOutlined />, label: "Relax Plans" },
      { key: "/meal-plans", icon: <CoffeeOutlined />, label: "Meal Plans" },
      { key: "/nutrition-intake", icon: <FundOutlined />, label: "Nutrition Intake" },
      { key: "/nutrition-goals", icon: <AimOutlined />, label: "Nutrition Goals" },
      { key: "/habits", icon: <FundOutlined />, label: "Habits" },
      { key: "/relax-sessions", icon: <ClockCircleOutlined />, label: "Relax Sessions" },
      { key: "/chat-messages", icon: <MessageOutlined />, label: "Chat Messages" },
    ],
    []
  );

  const selectedKeys = useMemo(() => {
    const match = items.find((i) => i.key !== "/" && pathname.startsWith(i.key));
    return [match?.key || "/"]; 
  }, [pathname, items]);

  const onClick = useCallback((e: any) => {
    router.push(e.key);
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} breakpoint="lg" width={240} style={{ background: "#fff" }}>
      <div className="h-16 flex items-center justify-center text-base font-semibold border-b">Fitness CMS</div>
      <Menu mode="inline" items={items} onClick={onClick} selectedKeys={selectedKeys} style={{ border: 0 }} />
      <div className="mt-auto p-3">
        <Button icon={<LogoutOutlined />} danger block onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </Sider>
  );
}

