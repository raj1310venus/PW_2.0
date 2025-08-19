export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment successful 🎉</h1>
      <p className="text-[var(--muted)] mb-8">Thank you for your purchase. Your order is being processed.</p>
      <a href="/" className="btn-accent px-6 py-2 rounded-lg">Back to home</a>
    </div>
  );
}
