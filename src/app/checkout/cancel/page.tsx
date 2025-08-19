export default function CancelPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment canceled</h1>
      <p className="text-[var(--muted)] mb-8">Your checkout was canceled. You can continue shopping and try again.</p>
      <a href="/cart" className="btn-accent px-6 py-2 rounded-lg">Back to cart</a>
    </div>
  );
}
