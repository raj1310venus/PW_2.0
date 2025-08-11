import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import { ProductRepo } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const qText = (searchParams.get("q") || "").trim();
  const featuredParam = searchParams.get("featured");
  const limitParam = searchParams.get("limit");
  const featured = featuredParam === "1" || featuredParam === "true" ? true : undefined;
  const limit = limitParam ? Math.max(1, Math.min(50, Number(limitParam))) : undefined;
  const col = await getCollection<any>("products");
  if (col) {
    const q: any = {};
    if (category) q.categorySlug = category;
    if (featured !== undefined) q.featured = featured;
    if (qText) {
      q.$or = [
        { name: { $regex: qText, $options: "i" } },
        { description: { $regex: qText, $options: "i" } },
      ];
    }
    let cursor = col.find(q).sort({ createdAt: -1 });
    if (limit) cursor = cursor.limit(limit);
    const docs = await cursor.toArray();
    return NextResponse.json(docs.map(d => ({ ...d, _id: String(d._id) })));
  }
  const list = ProductRepo.list();
  let filtered = list;
  if (category) filtered = filtered.filter(p => p.categorySlug === category);
  if (featured !== undefined) filtered = filtered.filter(p => !!p.featured === featured);
  if (qText) {
    const qLower = qText.toLowerCase();
    filtered = filtered.filter(p =>
      (p.name && p.name.toLowerCase().includes(qLower)) ||
      (p.description && p.description.toLowerCase().includes(qLower))
    );
  }
  if (limit) filtered = filtered.slice(0, limit);
  return NextResponse.json(filtered);
}
