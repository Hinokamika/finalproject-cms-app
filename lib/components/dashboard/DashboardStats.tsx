"use client";
import { Card, Col, Row, Statistic } from "antd";

export default function DashboardStats({
  users,
  workouts,
  meals,
  activeToday,
  messages,
}: {
  users: number;
  workouts: number;
  meals: number;
  activeToday: number;
  messages: number;
}) {
  return (
    <div className="space-y-6">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="shadow-md hover:shadow-lg transition-shadow"
            hoverable
          >
            <Statistic
              title="Total Users"
              value={users}
              valueStyle={{ color: "#1890ff", fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="shadow-md hover:shadow-lg transition-shadow"
            hoverable
          >
            <Statistic
              title="Workout Plans"
              value={workouts}
              valueStyle={{ color: "#52c41a", fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="shadow-md hover:shadow-lg transition-shadow"
            hoverable
          >
            <Statistic
              title="Meal Plans"
              value={meals}
              valueStyle={{ color: "#faad14", fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="shadow-md hover:shadow-lg transition-shadow"
            hoverable
          >
            <Statistic
              title="Active Users Today"
              value={activeToday}
              valueStyle={{ color: "#f5222d", fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="shadow-md hover:shadow-lg transition-shadow"
            hoverable
          >
            <Statistic
              title="Messages"
              value={messages}
              valueStyle={{ color: "#722ed1", fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
