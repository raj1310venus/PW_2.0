import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (typeof phone !== "string" || phone.trim().length < 8) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    // Dev mode: bypass Twilio and pretend SMS sent
    if (process.env.TWILIO_DEV_MODE === "true") {
      return NextResponse.json({ ok: true, dev: true, code: "123456" });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
    if (!accountSid || !authToken || !verifySid) {
      return NextResponse.json({ error: "Server not configured for SMS (set TWILIO_* envs or enable TWILIO_DEV_MODE=true)" }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);
    await client.verify.v2.services(verifySid).verifications.create({ to: phone.trim(), channel: "sms" });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/auth/phone/send error", err);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
