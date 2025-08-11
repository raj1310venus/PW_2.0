export const metadata = {
  title: "Contact | Price War Store",
};

export default function ContactPage() {
  async function handleSubmit(formData: FormData) {
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      alert(data.ok ? "Thanks! We'll be in touch." : data.error || "Failed to send.");
    } catch (e) {
      alert("Network error. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Contact Us</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <form className="card p-6 space-y-4" action={handleSubmit}>
          <div>
            <label className="block text-sm text-white/70 mb-1" htmlFor="name">Name</label>
            <input id="name" name="name" className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-[var(--accent)]" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1" htmlFor="email">Email</label>
              <input id="email" type="email" name="email" className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-[var(--accent)]" required />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-[var(--accent)]" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1" htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={4} className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-[var(--accent)]" required />
          </div>
          <button type="submit" className="btn-accent px-5 py-2 rounded-md font-medium">Send</button>
          <p className="text-xs text-white/60">This is a demo form. We will wire it to an API route with SendGrid/Twilio next.</p>
        </form>

        {/* Map */}
        <div className="card overflow-hidden">
          <iframe
            title="644 Danforth Ave & Pape Ave, Toronto"
            width="100%"
            height="100%"
            className="w-full h-96"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=644%20Danforth%20Ave%20%26%20Pape%20Ave,%20Toronto%2C%20ON&output=embed"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-4"><div className="text-sm text-white/60">Address</div><div className="font-medium">644 Danforth Ave & Pape Ave, Toronto, ON</div></div>
        <div className="card p-4"><div className="text-sm text-white/60">Phone</div><div className="font-medium">(123) 456-7890</div></div>
        <div className="card p-4"><div className="text-sm text-white/60">Email</div><div className="font-medium">info@pricewarstore.com</div></div>
      </div>
    </div>
  );
}
