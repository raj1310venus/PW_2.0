import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCollection } from "@/lib/mongo";
import type { Order } from "@/lib/types";

export const runtime = "nodejs"; // ensure Node runtime

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!webhookSecret || !stripeSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });
  const signature = headers().get("stripe-signature");
  const payload = await req.text(); // raw body

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing Stripe signature header");
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err?.message);
    return new NextResponse("Signature verification failed", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionId = session.id;
        const customerEmail = session.customer_details?.email || undefined;

        const col = await getCollection<Order>("orders");
        if (col) {
          await col.updateOne(
            { stripeSessionId: sessionId },
            {
              $set: {
                status: "paid",
                customerEmail,
                updatedAt: new Date().toISOString(),
              },
            }
          );
        }
        break;
      }
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionId = session.id;
        const col = await getCollection<Order>("orders");
        if (col) {
          await col.updateOne(
            { stripeSessionId: sessionId },
            { $set: { status: "failed", updatedAt: new Date().toISOString() } }
          );
        }
        break;
      }
      default: {
        // ignore other events for now
      }
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err) {
    console.error("Error handling Stripe webhook", err);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
