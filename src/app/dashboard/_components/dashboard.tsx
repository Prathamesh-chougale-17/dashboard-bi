"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Scatter,
  ScatterChart,
} from "recharts";
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  Percent,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

interface StockData {
  Month: any;
  "Date ": string;
  "OPEN ": number;
  "HIGH ": number;
  "LOW ": number;
  "close ": number;
  "VOLUME ": number;
  "vwap ": number;
  "No of trades ": number;
  "52W H ": number;
  "52W L ": number;
}

const DashboardClient = ({ initialData }: { initialData: StockData[] }) => {
  const [isClient, setIsClient] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const [volumeRange, setVolumeRange] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [trendFilter, setTrendFilter] = useState("all");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate unique months from data
  const uniqueMonths = useMemo(() => {
    return Array.from(new Set(initialData.map((item) => item.Month)));
  }, [initialData]);

  // Filter data based on all criteria
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      if (dateRange === "lastWeek") {
        const itemDate = new Date(item["Date "]);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (itemDate < weekAgo) return false;
      } else if (dateRange === "lastMonth") {
        const itemDate = new Date(item["Date "]);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        if (itemDate < monthAgo) return false;
      }

      if (minPrice && item["close "] < Number(minPrice)) return false;
      if (maxPrice && item["close "] > Number(maxPrice)) return false;

      if (volumeRange === "high") {
        const avgVolume =
          initialData.reduce((sum, d) => sum + d["VOLUME "], 0) /
          initialData.length;
        if (item["VOLUME "] <= avgVolume) return false;
      } else if (volumeRange === "low") {
        const avgVolume =
          initialData.reduce((sum, d) => sum + d["VOLUME "], 0) /
          initialData.length;
        if (item["VOLUME "] > avgVolume) return false;
      }

      if (selectedMonth !== "all" && item.Month !== selectedMonth) return false;

      if (trendFilter === "bullish" && item["close "] <= item["OPEN "])
        return false;
      if (trendFilter === "bearish" && item["close "] >= item["OPEN "])
        return false;

      return true;
    });
  }, [
    initialData,
    dateRange,
    minPrice,
    maxPrice,
    volumeRange,
    selectedMonth,
    trendFilter,
  ]);

  // Calculate metrics based on filtered data
  const metrics = useMemo(() => {
    if (!filteredData.length) return null;

    const highestPrice = Math.max(...filteredData.map((item) => item["HIGH "]));
    const lowestPrice = Math.min(...filteredData.map((item) => item["LOW "]));
    const totalVolume = filteredData.reduce(
      (sum, item) => sum + item["VOLUME "],
      0
    );
    const avgVolume = totalVolume / filteredData.length;
    const totalTrades = filteredData.reduce(
      (sum, item) => sum + item["No of trades "],
      0
    );
    const avgPrice =
      filteredData.reduce((sum, item) => sum + item["close "], 0) /
      filteredData.length;
    const priceChange =
      filteredData[filteredData.length - 1]["close "] -
      filteredData[0]["close "];
    const priceChangePercent = (
      (priceChange / filteredData[0]["close "]) *
      100
    ).toFixed(2);
    const volatility = (
      ((highestPrice - lowestPrice) / avgPrice) *
      100
    ).toFixed(2);

    return {
      highestPrice,
      lowestPrice,
      totalVolume,
      avgVolume,
      totalTrades,
      avgPrice,
      priceChange,
      priceChangePercent,
      volatility,
    };
  }, [filteredData]);

  // Calculate price distribution data from filtered data
  const priceDistributionData = useMemo(() => {
    if (!filteredData.length) return [];

    const minPrice = Math.min(...filteredData.map((item) => item["close "]));
    const maxPrice = Math.max(...filteredData.map((item) => item["close "]));
    const priceRange = maxPrice - minPrice;
    const interval = priceRange / 5;

    const ranges = {
      "Very Low": 0,
      Low: 0,
      Medium: 0,
      High: 0,
      "Very High": 0,
    };

    filteredData.forEach((item) => {
      const price = item["close "];
      if (price <= minPrice + interval) ranges["Very Low"]++;
      else if (price <= minPrice + 2 * interval) ranges["Low"]++;
      else if (price <= minPrice + 3 * interval) ranges["Medium"]++;
      else if (price <= minPrice + 4 * interval) ranges["High"]++;
      else ranges["Very High"]++;
    });

    return Object.entries(ranges).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredData]);

  // Calculate trading patterns from filtered data
  const tradingPatterns = useMemo(
    () => [
      {
        name: "Bullish",
        value: filteredData.filter((item) => item["close "] > item["OPEN "])
          .length,
      },
      {
        name: "Bearish",
        value: filteredData.filter((item) => item["close "] < item["OPEN "])
          .length,
      },
      {
        name: "Neutral",
        value: filteredData.filter((item) => item["close "] === item["OPEN "])
          .length,
      },
    ],
    [filteredData]
  );

  // Prepare volume distribution data from filtered data
  const volumeStats = useMemo(
    () =>
      filteredData.map((item) => ({
        date: item["Date "],
        volume: item["VOLUME "],
        trades: item["No of trades "],
        price: item["close "],
      })),
    [filteredData]
  );

  // Calculate radar chart data from filtered data
  const calculatePercentageOfMax = (value: number, max: number) =>
    (value / max) * 100;

  const radarData = useMemo(() => {
    if (!filteredData.length) return [];

    const latestData = filteredData[filteredData.length - 1];
    const maxVolume = Math.max(...filteredData.map((item) => item["VOLUME "]));
    const maxTrades = Math.max(
      ...filteredData.map((item) => item["No of trades "])
    );

    const latestMetrics = {
      price: calculatePercentageOfMax(
        latestData["close "],
        latestData["52W H "]
      ),
      volume: calculatePercentageOfMax(latestData["VOLUME "], maxVolume),
      trades: calculatePercentageOfMax(latestData["No of trades "], maxTrades),
      high: calculatePercentageOfMax(latestData["HIGH "], latestData["52W H "]),
      low: calculatePercentageOfMax(latestData["LOW "], latestData["52W H "]),
    };

    return [
      {
        subject: "Price",
        A: latestMetrics.price,
        fullMark: 100,
      },
      {
        subject: "Volume",
        A: latestMetrics.volume,
        fullMark: 100,
      },
      {
        subject: "Trades",
        A: latestMetrics.trades,
        fullMark: 100,
      },
      {
        subject: "High",
        A: latestMetrics.high,
        fullMark: 100,
      },
      {
        subject: "Low",
        A: latestMetrics.low,
        fullMark: 100,
      },
    ];
  }, [filteredData]);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Adani Analytics</h1>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="lastWeek">Last Week</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={volumeRange} onValueChange={setVolumeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Volume Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Volumes</SelectItem>
                <SelectItem value="high">High Volume</SelectItem>
                <SelectItem value="low">Low Volume</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {uniqueMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={trendFilter} onValueChange={setTrendFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trend Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trends</SelectItem>
                <SelectItem value="bullish">Bullish Days</SelectItem>
                <SelectItem value="bearish">Bearish Days</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Price Range</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{metrics.highestPrice.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Low: ₹{metrics.lowestPrice.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Volume
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalVolume.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: {Math.round(metrics.avgVolume).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Price Change
              </CardTitle>
              {metrics.priceChange >= 0 ? (
                <ArrowUpCircle className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownCircle className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  metrics.priceChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {metrics.priceChangePercent}%
              </div>
              <p className="text-xs text-muted-foreground">
                ₹{Math.abs(metrics.priceChange).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volatility</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.volatility}%</div>
              <p className="text-xs text-muted-foreground">High-Low spread</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Price Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priceDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {priceDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trading Patterns Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Trading Patterns</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tradingPatterns}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {tradingPatterns.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Volume Analysis Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Volume Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="volume"
                fill="#8884d8"
                name="Volume"
              />
              <Bar
                yAxisId="right"
                dataKey="trades"
                fill="#82ca9d"
                name="Trades"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Price vs Volume Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle>Price vs Volume Correlation</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="volume" name="Volume" />
              <YAxis type="number" dataKey="price" name="Price" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Price-Volume" data={volumeStats} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart for Multiple Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Metric Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Metrics"
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Price Components Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Price Components Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Date " />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="OPEN " stackId="a" fill="#8884d8" name="Open" />
              <Bar dataKey="close " stackId="a" fill="#82ca9d" name="Close" />
              <Bar dataKey="vwap " stackId="a" fill="#ffc658" name="VWAP" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardClient;
