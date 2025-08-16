export const metadata = {
  title: "About | Price War Store",
};

import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-16 animate-fade-in-down">
        <h1 className="text-5xl font-bold tracking-tight">About Price War Store</h1>
        <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
          Discover the heart behind our deals and the values that drive us forward.
        </p>
      </header>

      <main className="space-y-20">
        <section>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
              <p className="text-white/80 leading-relaxed">
                To bring everyday essentials and seasonal favorites to our community at exceptional prices without compromising on quality or service. We believe that everyone deserves access to great products, and we're dedicated to curating a collection that offers unbeatable value and makes shopping a delight.
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src="/images/product-gallery/store-aisle.png" alt="Our Mission" fill className="object-cover" />
            </div>
          </div>
        </section>

        <section>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 rounded-lg overflow-hidden md:order-last">
              <Image src="/images/product-gallery/store-front.png" alt="Our Story" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
              <p className="text-white/80 leading-relaxed">
                Founded in the vibrant heart of Toronto, Price War Store started as a small family-run shop with a big idea: to create a go-to destination for savvy shoppers. From our humble beginnings at 644 Danforth Ave, we've grown into a beloved local landmark, known for our friendly service and incredible finds. Our journey is one of passion, persistence, and a deep connection to the community we serve.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-8">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Community First</h3>
              <p className="text-white/80">We are deeply rooted in our community and strive to make a positive impact every day.</p>
            </div>
            <div className="card p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Unbeatable Value</h3>
              <p className="text-white/80">We are committed to providing the best prices without sacrificing quality.</p>
            </div>
            <div className="card p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Customer Delight</h3>
              <p className="text-white/80">Your happiness is our priority. We aim to exceed your expectations with every visit.</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-8">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-4">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <Image src={`https://i.pravatar.cc/150?img=${i + 10}`} alt={`Team Member ${i + 1}`} fill className="object-cover" />
                </div>
                <h3 className="font-bold">Jane Doe</h3>
                <p className="text-sm text-accent">Founder & CEO</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
