import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { token } = await req.json().catch(() => ({}));
  const envToken = process.env.ADMIN_TOKEN || "dev"; // allow dev if unset
  const ok = typeof token === "string" && token.length > 0 && token === envToken;
  if (!ok) return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  // set httpOnly cookie for 7 days
  res.cookies.set({ name: "admin_token", value: token, httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
