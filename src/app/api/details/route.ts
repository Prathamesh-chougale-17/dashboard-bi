import { NextResponse } from "next/server";
import clientPromise from "@/lib/clientpromise";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const state = searchParams.get("state");
  const paymentMode = searchParams.get("paymentMode");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  console.log({ category, state, paymentMode, startDate, endDate });

  try {
    const client = await clientPromise;
    const db = client.db("powerbi");

    let query: any = {};

    if (category) query.Category = category;
    if (paymentMode) query.PaymentMode = paymentMode;

    console.log(query);

    const details = await db.collection("details").find(query).toArray();
    console.log(details);
    return NextResponse.json(details);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch details" },
      { status: 500 }
    );
  }
}
