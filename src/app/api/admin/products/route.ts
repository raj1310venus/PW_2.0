import { NextResponse } from "next/server";
import { ProductRepo } from "@/lib/db";
import { requireAdminServer } from "@/lib/admin";
import { getCollection } from "@/lib/mongo";
import type { Product } from "@/lib/types";

export async function GET() {
  try {
    const auth = requireAdminServer();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: auth.status || 401 });
    }

    const col = await getCollection<Product>("products");
    if (col) {
      const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json(docs.map(d => ({
        ...d,
        _id: String(d._id),
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : new Date().toISOString()
      })));
    }
    return NextResponse.json(ProductRepo.list());
  } catch (error) {
    console.error('Error in GET /api/admin/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = requireAdminServer();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: auth.status || 401 });
    }

    const body = await req.json().catch(() => ({}));
    const col = await getCollection<Product>("products");
    
    const now = new Date().toISOString();
    const newProduct = {
      name: String(body.name || "New Product"),
      slug: String(body.slug || `prod-${Math.random().toString(36).slice(2, 7)}`),
      categorySlug: String(body.categorySlug || "uncategorized"),
      price: Number(body.price || 0),
      imageUrl: body.imageUrl || '',
      description: body.description || '',
      featured: Boolean(body.featured || false),
      createdAt: now,
      updatedAt: now,
    };

    if (col) {
      // Create a new document with all required fields
      const productDoc = {
        name: newProduct.name,
        slug: newProduct.slug,
        categorySlug: newProduct.categorySlug,
        price: newProduct.price,
        imageUrl: newProduct.imageUrl,
        description: newProduct.description,
        featured: newProduct.featured,
        createdAt: newProduct.createdAt,
        updatedAt: newProduct.updatedAt
      };
      
      // Insert the document
      const result = await col.insertOne(productDoc as any);
      
      // Return the created product with the generated _id
      return NextResponse.json(
        { ...newProduct, _id: String(result.insertedId) },
        { status: 201 }
      );
    }

    // Fallback to in-memory storage
    const created = ProductRepo.create({
      name: newProduct.name,
      slug: newProduct.slug,
      categorySlug: newProduct.categorySlug,
      price: newProduct.price,
      imageUrl: newProduct.imageUrl,
      description: newProduct.description,
      featured: newProduct.featured,
      createdAt: now,
      updatedAt: now,
    });
    
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/products:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
