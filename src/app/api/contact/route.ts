import { NextResponse } from "next/server";

function isEmail(v: string) {
  return /.+@.+\..+/.test(v);
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();
    if (!name || !email || !message || !isEmail(String(email))) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const payload = {
      name: String(name),
      email: String(email),
      phone: String(phone || ""),
      message: String(message),
      timestamp: new Date().toISOString(),
    };

    // Attempt SendGrid if configured and available
    const apiKey = process.env.SENDGRID_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_TO_EMAIL;

    if (apiKey && toEmail) {
      try {
        // dynamic import so the app runs even if dependency isn't installed yet
        // (we'll install @sendgrid/mail later during deployment)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const sgModule = await import("@sendgrid/mail");
        const sg = (sgModule as any).default || sgModule;
        sg.setApiKey(apiKey);
        await sg.send({
          to: toEmail,
          from: toEmail,
          subject: `New contact from ${payload.name}`,
          text: `${payload.name} <${payload.email}> (${payload.phone})\n\n${payload.message}`,
        });
      } catch (e) {
        console.warn("SendGrid not available, falling back to console log.", e);
        console.log("CONTACT_FORM", payload);
      }
    } else {
      console.log("CONTACT_FORM", payload);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
