import { cookies } from "next/headers";
import LoginForm from "@/components/admin/LoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic"; // always evaluate cookie on each request

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const envToken = process.env.ADMIN_TOKEN || "dev";
  const authed = token && token === envToken;

  if (!authed) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
        <LoginForm />
        <p className="mt-4 text-sm text-white/60">Use your admin token to sign in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}
