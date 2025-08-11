import { cookies } from "next/headers";

export function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const envToken = process.env.ADMIN_TOKEN || "dev";
  if (!token || token !== envToken) {
    return { ok: false as const, status: 401, error: "Unauthorized" };
  }
  return { ok: true as const };
}
