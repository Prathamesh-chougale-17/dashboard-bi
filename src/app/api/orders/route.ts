import { NextResponse } from "next/server";
import clientPromise from "@/lib/clientpromise";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("powerbi");
    const orders = await db.collection("order").find({}).toArray();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
