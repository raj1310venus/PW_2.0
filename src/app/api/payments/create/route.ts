import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import type { Order, OrderItem } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { items, amount, currency = "cad", metadata } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const baseUrl = process.env.HYPERSWITCH_BASE_URL;
    const secret = process.env.HYPERSWITCH_SECRET_KEY;
    const merchantId = process.env.HYPERSWITCH_MERCHANT_ID;

    if (!baseUrl || !secret || !merchantId) {
      return NextResponse.json({ error: "Hyperswitch env vars not configured" }, { status: 500 });
    }

    // Create payment intent in Hyperswitch
    const res = await fetch(`${baseUrl}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": secret,
        "x-merchant-id": merchantId,
      },
      body: JSON.stringify({
        amount, // cents
        currency,
        capture_method: "automatic",
        confirm: false,
        authentication_type: "three_ds_optional",
        description: "Order payment",
        metadata: metadata || {},
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Persist a pending order
    const orders = await getCollection<Order>("orders");
    const now = new Date();

    const orderItems: OrderItem[] = Array.isArray(items)
      ? items.map((it: any) => ({ id: String(it.id), name: it.name, price: it.price, qty: it.qty, imageUrl: it.imageUrl }))
      : [];

    const order: Omit<Order, "_id"> = {
      items: orderItems,
      currency,
      amount,
      status: "pending",
      stripeSessionId: undefined, // not used here
      paymentProvider: "hyperswitch",
      paymentId: data.id,
      clientSecret: data.client_secret,
      createdAt: now,
      updatedAt: now,
    } as any;

    await orders.insertOne(order as any);

    return NextResponse.json({
      payment_id: data.id,
      client_secret: data.client_secret,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
