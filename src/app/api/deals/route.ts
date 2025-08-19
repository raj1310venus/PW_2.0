import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import type { Deal } from "@/lib/types";
import { initialDeals } from "@/lib/initial-data";

export async function GET() {
  try {
    const col = await getCollection<Deal>("deals");
    if (col) {
      const docs = await col.find({}).sort({ _id: 1 }).toArray();
      return NextResponse.json(
        docs.map((d: any) => ({ ...d, _id: String(d._id) }))
      );
    }
    return NextResponse.json(initialDeals);
  } catch (error) {
    console.error("Error in GET /api/deals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
