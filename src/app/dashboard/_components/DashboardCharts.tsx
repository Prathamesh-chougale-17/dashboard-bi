import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order, OrderDetails } from "@/types";

interface DashboardChartsProps {
  orders: Order[];
  details: OrderDetails[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function DashboardCharts({
  orders,
  details,
}: DashboardChartsProps) {
  // Calculate data for different visualizations
  const stateWiseOrders = orders.reduce<Record<string, number>>(
    (acc, order) => {
      acc[order.State] = (acc[order.State] || 0) + 1;
      return acc;
    },
    {}
  );

  const categoryWiseStats = details.reduce<
    Record<string, { totalAmount: number; totalProfit: number; count: number }>
  >((acc, detail) => {
    if (!acc[detail.Category]) {
      acc[detail.Category] = {
        totalAmount: 0,
        totalProfit: 0,
        count: 0,
      };
    }
    acc[detail.Category].totalAmount += detail.Amount;
    acc[detail.Category].totalProfit += detail.Profit;
    acc[detail.Category].count += 1;
    return acc;
  }, {});

  const paymentModeData = details.reduce<Record<string, number>>(
    (acc, detail) => {
      acc[detail.PaymentMode] = (acc[detail.PaymentMode] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sales by Category Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            width={500}
            height={300}
            data={Object.entries(categoryWiseStats).map(
              ([category, stats]) => ({
                name: category,
                amount: stats.totalAmount,
              })
            )}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </CardContent>
      </Card>

      {/* Payment Mode Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Mode Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart width={500} height={300}>
            <Pie
              data={Object.entries(paymentModeData).map(([mode, count]) => ({
                name: mode,
                value: count,
              }))}
              cx={250}
              cy={150}
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {Object.entries(paymentModeData).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>

      {/* Profit by Category Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Profit Trends by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            width={500}
            height={300}
            data={Object.entries(categoryWiseStats).map(
              ([category, stats]) => ({
                name: category,
                profit: stats.totalProfit,
              })
            )}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
          </LineChart>
        </CardContent>
      </Card>

      {/* State-wise Orders Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Orders by State</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart
            width={500}
            height={300}
            data={Object.entries(stateWiseOrders).map(([state, count]) => ({
              name: state,
              orders: count,
            }))}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </CardContent>
      </Card>
    </div>
  );
}
