import { NextResponse } from "next/server";
import { CategoryRepo } from "@/lib/db";
import { requireAdminServer } from "@/lib/admin";
import { getCollection } from "@/lib/mongo";
import type { Category } from "@/lib/types";

export async function GET() {
  try {
    const auth = requireAdminServer();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: auth.status || 401 });
    }

    const col = await getCollection<Category>("categories");
    if (col) {
      const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json(docs.map(d => ({
        ...d,
        _id: String(d._id),
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : new Date().toISOString()
      })));
    }
    return NextResponse.json(CategoryRepo.list());
  } catch (error) {
    console.error('Error in GET /api/admin/categories:', error);
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const col = await getCollection<Category>("categories");
    
    const now = new Date().toISOString();
    const newCategory = {
      label: String(body.label || "Untitled"),
      slug: String(body.slug || `cat-${Math.random().toString(36).slice(2, 7)}`),
      imageUrl: body.imageUrl || '',
      createdAt: now,
      updatedAt: now,
    };

    if (col) {
      // Insert the category data without _id
      const result = await col.insertOne({
        label: newCategory.label,
        slug: newCategory.slug,
        imageUrl: newCategory.imageUrl,
        createdAt: newCategory.createdAt,
        updatedAt: newCategory.updatedAt
      });
      return NextResponse.json(
        { ...newCategory, _id: String(result.insertedId) },
        { status: 201 }
      );
    }

    // Fallback to in-memory storage
    const created = CategoryRepo.create({
      label: newCategory.label,
      slug: newCategory.slug,
      imageUrl: newCategory.imageUrl,
      createdAt: now,
      updatedAt: now,
    });
    
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/categories:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
