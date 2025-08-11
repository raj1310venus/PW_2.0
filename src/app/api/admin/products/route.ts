import { NextResponse } from "next/server";
import { ProductRepo } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { getCollection } from "@/lib/mongo";

export async function GET() {
  const auth = requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const col = await getCollection<any>("products");
  if (col) {
    const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(docs.map(d => ({ ...d, _id: String(d._id) })));
  }
  return NextResponse.json(ProductRepo.list());
}

export async function POST(req: Request) {
  const auth = requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json().catch(() => ({}));
  const col = await getCollection<any>("products");
  if (col) {
    const doc: any = {
      name: String(body.name || "New Product"),
      slug: String(body.slug || "prod-" + Math.random().toString(36).slice(2, 7)),
      categorySlug: String(body.categorySlug || "uncategorized"),
      price: Number(body.price || 0),
      imageUrl: body.imageUrl || undefined,
      description: body.description || undefined,
      featured: Boolean(body.featured || false),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const res = await col.insertOne(doc);
    return NextResponse.json({ ...doc, _id: String(res.insertedId) }, { status: 201 });
  }
  const created = ProductRepo.create({
    name: body.name,
    slug: body.slug,
    categorySlug: body.categorySlug,
    price: body.price,
    imageUrl: body.imageUrl,
    description: body.description,
    featured: body.featured,
  });
  return NextResponse.json(created, { status: 201 });
}
