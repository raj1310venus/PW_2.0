import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import { ProductRepo } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const adminCheck = requireAdmin();
  if (!adminCheck.ok) {
    return new Response(adminCheck.error, { status: adminCheck.status });
  }

  try {
    const body = await req.json();
    const { featured } = body;
    const { id } = params;

    if (!id) {
      return new Response("Product ID is required", { status: 400 });
    }

    // Try to update in MongoDB first
    const col = await getCollection<any>("products");
    if (col) {
      const result = await col.updateOne(
        { _id: id },
        { $set: { featured, updatedAt: new Date() } }
      );
      if (result.matchedCount > 0) {
        return NextResponse.json({ success: true });
      }
    }

    // Fallback to ProductRepo if MongoDB is not available
    const updated = ProductRepo.update(id, { featured, updatedAt: new Date().toISOString() });
    if (updated) {
      return NextResponse.json({ success: true });
    } else {
      return new Response("Product not found", { status: 404 });
    }
  } catch (error) {
    console.error("Failed to update product:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const adminCheck = requireAdmin();
  if (!adminCheck.ok) {
    return new Response(adminCheck.error, { status: adminCheck.status });
  }

  try {
    const { id } = params;

    if (!id) {
      return new Response("Product ID is required", { status: 400 });
    }

    // Try to delete from MongoDB first
    const col = await getCollection<any>("products");
    if (col) {
      const result = await col.deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        return NextResponse.json({ success: true });
      }
    }

    // Fallback to ProductRepo if MongoDB is not available
    const deleted = ProductRepo.remove(id);
    if (deleted) {
      return NextResponse.json({ success: true });
    } else {
      return new Response("Product not found", { status: 404 });
    }
  } catch (error) {
    console.error("Failed to delete product:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
