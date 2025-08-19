import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCollection } from "@/lib/mongo";
import type { Order, OrderItem } from "@/lib/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
    }

    const body = await req.json();
    const items: OrderItem[] = body?.items || [];
    const currency = (body?.currency || "cad").toLowerCase();
    const customerEmail: string | undefined = body?.customerEmail;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Build absolute base URL first (used for success/cancel and images)
    let base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000";
    try {
      const u = new URL(base);
      base = u.toString().replace(/\/$/, "");
    } catch {
      base = "http://localhost:4000";
    }

    // Build Stripe line items (omit images to avoid URL issues)
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const product_data: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData = {
        name: item.name,
      };
      return {
        quantity: item.quantity,
        price_data: {
          currency,
          product_data,
          unit_amount: item.price, // expecting minor units (cents)
        },
        adjustable_quantity: { enabled: true, minimum: 1 },
      };
    });

    // Amounts for local order record
    const amountSubtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const amountTotal = amountSubtotal; // no shipping/taxes in this MVP

    console.log("Stripe Checkout base URL:", base);
    console.log("Stripe Checkout line_items:", JSON.stringify(line_items));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout/cancel`,
      customer_email: customerEmail,
    });

    // Persist pending order in Mongo
    try {
      const col = await getCollection<Order>("orders");
      if (col) {
        const now = new Date().toISOString();
        await col.insertOne({
          items,
          currency,
          amountSubtotal,
          amountTotal,
          status: "pending",
          stripeSessionId: session.id,
          customerEmail,
          createdAt: now,
          updatedAt: now,
        } as Order as any);
      }
    } catch (e) {
      console.warn("Failed to persist pending order", e);
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Create checkout session error", err?.message || err, err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
