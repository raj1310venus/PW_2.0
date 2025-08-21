import { NextResponse } from "next/server";
import { CategoryRepo } from "@/lib/db";
import { requireAdminServer } from "@/lib/admin";
import { getCollection } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminServer();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json().catch(() => ({}));
  const col = await getCollection<any>("categories");
  if (col) {
    try {
      const _id = new ObjectId(params.id);
      const res = await col.findOneAndUpdate(
        { _id },
        { $set: { ...body, updatedAt: new Date().toISOString() } },
        { returnDocument: "after" }
      );
      if (!res?.value) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const doc = res.value;
      return NextResponse.json({ ...doc, _id: String(doc._id) });
    } catch {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
  }
  const updated = CategoryRepo.update(params.id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminServer();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const col = await getCollection<any>("categories");
  if (col) {
    try {
      const _id = new ObjectId(params.id);
      const res = await col.deleteOne({ _id });
      if (!res.deletedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
  }
  const ok = CategoryRepo.remove(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
