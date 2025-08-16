'use client';
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqItems = [
  { q: 'What are your store hours?', a: 'We are open Mon–Sat from 9 AM to 8 PM, and Sunday from 10 AM to 6 PM.' },
  { q: 'Do you offer online ordering?', a: 'Currently, we do not offer online ordering, but we are working on it! Please visit us in-store for the best deals.' },
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of purchase with a valid receipt. Items must be in their original condition.' },
  { q: 'How can I find out about new deals?', a: 'The best way to stay updated is to follow us on our social media channels and visit our in-store promotions.' },
];

export default function ContactPageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleSubmit(formData: FormData) {
    const payload = {
      department: String(formData.get('department') || ''),
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || ''),
    };
    console.log('Form submitted:', payload);
    alert(`Thank you, ${payload.name}! Your message for ${payload.department} has been received.`);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-16 animate-fade-in-down">
        <h1 className="text-5xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
          Your feedback and questions are important to us. Here’s how you can reach our team.
        </p>
      </header>

      <main className="space-y-20">
        <section>
          <div className="grid lg:grid-cols-3 gap-12">
            <form className="card p-6 space-y-4 lg:col-span-2" action={handleSubmit}>
              <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>
              <div>
                <label className="block text-sm text-white/70 mb-1" htmlFor="department">Department</label>
                <select id="department" name="department" className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-accent" required>
                  <option>General Inquiry</option>
                  <option>Customer Support</option>
                  <option>Sales & Promotions</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1" htmlFor="name">Your Name</label>
                  <input id="name" name="name" className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-accent" required />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1" htmlFor="email">Your Email</label>
                  <input id="email" type="email" name="email" className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-accent" required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1" htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-accent" required />
              </div>
              <div>
                <button type="submit" className="btn-accent px-6 py-2.5 rounded-md font-semibold">Submit</button>
                <p className="text-xs text-white/60 mt-3">We respect your privacy. Your information will not be shared.</p>
              </div>
            </form>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-3">Operating Hours</h3>
                <ul className="text-white/80 space-y-1 text-sm">
                  <li><strong>Mon–Sat:</strong> 9:00 AM – 8:00 PM</li>
                  <li><strong>Sunday:</strong> 10:00 AM – 6:00 PM</li>
                </ul>
                <p className="text-xs text-white/60 mt-3">Our team typically responds within 24 hours during business days.</p>
              </div>
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-3">Connect With Us</h3>
                <div className="flex items-center justify-center gap-4">
                  <a href="#" className="text-white/70 hover:text-accent transition-colors"><Facebook /></a>
                  <a href="#" className="text-white/70 hover:text-accent transition-colors"><Twitter /></a>
                  <a href="#" className="text-white/70 hover:text-accent transition-colors"><Instagram /></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-8">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-4 text-left flex justify-between items-center">
                  <span className="font-medium">{item.q}</span>
                  <ChevronDown className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <p className="p-4 pt-0 text-white/80">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="card overflow-hidden rounded-lg">
            <iframe
              title="644 Danforth Ave & Pape Ave, Toronto"
              width="100%"
              height="450"
              className="w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=644%20Danforth%20Ave%20%26%20Pape%20Ave,%20Toronto%2C%20ON&output=embed"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
