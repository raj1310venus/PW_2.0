export const metadata = {
  title: "About | Price War Store",
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">About Price War Store</h1>
      <p className="text-white/80 max-w-3xl">
        We bring everyday essentials and seasonal favorites to Toronto at exceptional prices.
        Visit us at 644 Danforth Ave & Pape Ave. Our promise: friendly service, curated
        value, and convenient shopping hours.
      </p>
      <ul className="grid sm:grid-cols-2 gap-4">
        <li className="card p-4"><strong>Hours:</strong> Mon–Sat 9 AM–8 PM, Sun 10 AM–6 PM</li>
        <li className="card p-4"><strong>Contact:</strong> (123) 456-7890 · info@pricewarstore.com</li>
      </ul>
    </div>
  );
}
