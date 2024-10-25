"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import DashboardCharts from "./_components/DashboardCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order, OrderDetails } from "@/types";
import { addDays } from "date-fns";

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [details, setDetails] = useState<OrderDetails[]>([]);
  const [filters, setFilters] = useState({
    category: "",
    paymentMode: "",
    dateRange: {
      from: addDays(new Date(), -30),
      to: new Date(),
    },
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [paymentModes, setPaymentModes] = useState<string[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [ordersRes, detailsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/details"),
      ]);
      const [ordersData, detailsData] = await Promise.all([
        ordersRes.json(),
        detailsRes.json(),
      ]);

      setOrders(ordersData);
      setDetails(detailsData);

      // Extract unique categories and payment modes
      setCategories([
        //@ts-ignore
        ...new Set(detailsData.map((d: OrderDetails) => d.Category)),
      ]);
      setPaymentModes([
        //@ts-ignore
        ...new Set(detailsData.map((d: OrderDetails) => d.PaymentMode)),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const applyFilters = async () => {
    const queryParams = new URLSearchParams();

    if (filters.category) queryParams.append("category", filters.category);
    if (filters.paymentMode)
      queryParams.append("paymentMode", filters.paymentMode);
    if (filters.dateRange.from)
      queryParams.append(
        "startDate",
        filters.dateRange.from.toISOString().split("T")[0]
      );
    if (filters.dateRange.to)
      queryParams.append(
        "endDate",
        filters.dateRange.to.toISOString().split("T")[0]
      );

    try {
      const response = await fetch(`/api/details?${queryParams.toString()}`);
      const filteredData = await response.json();
      setDetails(filteredData);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      paymentMode: "",
      dateRange: {
        from: addDays(new Date(), -30),
        to: new Date(),
      },
    });
    fetchInitialData();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Atharv Enterprises Dashboard</h1>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.paymentMode}
            onValueChange={(value) =>
              setFilters({ ...filters, paymentMode: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Mode" />
            </SelectTrigger>
            <SelectContent>
              {paymentModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePickerWithRange
            value={filters.dateRange}
            onChange={(range) =>
              setFilters({
                ...filters,
                dateRange: {
                  from: range?.from ?? new Date(),
                  to: range?.to ?? new Date(),
                },
              })
            }
          />

          <div className="flex gap-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <DashboardCharts orders={orders} details={details} />
    </div>
  );
}
