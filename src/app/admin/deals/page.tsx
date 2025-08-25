import { redirect } from "next/navigation";

export default function AdminDealsPage() {
  // Redirect this route to the main admin area; deals management now lives in the dashboard
  redirect("/admin");
}
