import { NextResponse } from "next/server";
import clientPromise from "@/lib/clientpromise";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const state = searchParams.get("state");
  const paymentMode = searchParams.get("paymentMode");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    const client = await clientPromise;
    const db = client.db("powerbi");

    let query: any = {};

    if (category) query.Category = category;
    if (paymentMode) query.PaymentMode = paymentMode;

    if (startDate && endDate) {
      query["Order ID"] = {
        $in: await db
          .collection("order")
          .distinct("Order ID", {
            "Order Date": {
              $gte: startDate,
              $lte: endDate,
            },
          }),
      };
    }

    const details = await db.collection("details").find(query).toArray();
    return NextResponse.json(details);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch details" },
      { status: 500 }
    );
  }
}
