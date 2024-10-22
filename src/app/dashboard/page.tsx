import { getAdaniData } from "@/lib/data";
import DashboardClient from "./_components/dashboard";

export const revalidate = 300; // Revalidate data every 5 minutes

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

export default async function DashboardPage() {
  const rawData = await getAdaniData();
  const data: StockData[] = rawData.map((item) => ({
    Month: item.Month,
    "Date ": item["Date "],
    "OPEN ": item["OPEN "],
    "HIGH ": item["HIGH "],
    "LOW ": item["LOW "],
    "close ": item["close "],
    "VOLUME ": item["VOLUME "],
    "vwap ": item["vwap "],
    "No of trades ": item["No of trades "],
    "52W H ": item["52W H "],
    "52W L ": item["52W L "],
  }));

  return (
    <div className="min-h-screen p-4">
      <DashboardClient initialData={data} />
    </div>
  );
}
