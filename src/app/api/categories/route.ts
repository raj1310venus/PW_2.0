import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import { CategoryRepo } from "@/lib/db";

export async function GET() {
  const col = await getCollection<any>("categories");
  if (col) {
    const docs = await col.find({}).project({}).sort({ label: 1 }).toArray();
    return NextResponse.json(docs.map(d => ({ ...d, _id: String(d._id) })));
  }
  return NextResponse.json(CategoryRepo.list());
}
