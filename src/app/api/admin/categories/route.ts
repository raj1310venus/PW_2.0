import { NextResponse } from "next/server";
import { CategoryRepo } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { getCollection } from "@/lib/mongo";
import type { Category } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET() {
  const auth = requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const col = await getCollection<Category>("categories");
  if (col) {
    const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(docs.map(d => ({ ...d, _id: String((d as any)._id) })));
  }
  return NextResponse.json(CategoryRepo.list());
}

export async function POST(req: Request) {
  const auth = requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json().catch(() => ({}));
  const col = await getCollection<Category>("categories");
  if (col) {
    const doc: any = {
      label: String(body.label || "Untitled"),
      slug: String(body.slug || "cat-" + Math.random().toString(36).slice(2, 7)),
      imageUrl: body.imageUrl || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const res = await col.insertOne(doc);
    return NextResponse.json({ ...doc, _id: String(res.insertedId) }, { status: 201 });
  }
  const created = CategoryRepo.create({ label: body.label, slug: body.slug, imageUrl: body.imageUrl });
  return NextResponse.json(created, { status: 201 });
}
