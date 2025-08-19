import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import { ProductRepo } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  const adminCheck = requireAdmin();
  if (!adminCheck.ok) {
    return new Response(adminCheck.error, { status: adminCheck.status });
  }

  try {
    const body = await req.json();
    const { name, slug, price, description, imageUrl, categorySlug, featured } = body;

    if (!name || !price || !categorySlug) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newProduct = {
      name,
      slug: slug || name.toLowerCase().replace(/ /g, "-"),
      price,
      description,
      imageUrl,
      categorySlug,
      featured: featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Try to save to MongoDB first
    const col = await getCollection<any>("products");
    if (col) {
      const result = await col.insertOne(newProduct);
      const savedProduct = { ...newProduct, _id: String(result.insertedId) };
      console.log("Product saved to MongoDB:", savedProduct);
      return NextResponse.json(savedProduct, { status: 201 });
    }

    // Fallback to ProductRepo if MongoDB is not available
    const productWithId = {
      ...newProduct,
      _id: `prod_${new Date().getTime()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    ProductRepo.create(productWithId);
    console.log("Product saved to ProductRepo:", productWithId);

    return NextResponse.json(productWithId, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

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

