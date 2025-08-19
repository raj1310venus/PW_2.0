import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import MainNav from "@/components/MainNav";
import RouteTransition from "@/components/RouteTransition";
import PromoStrip from "@/components/PromoStrip";
import ChatbotLoader from '@/components/ChatbotLoader';
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { DealsProvider } from "@/context/DealsContext";
import { ProductsProvider } from '@/context/ProductsContext';
import { initialDeals } from '@/lib/initial-data';
import AuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Price War Store",
  description: "Where value meets variety — 644 Danforth Ave & Pape Ave, Toronto",
  metadataBase: new URL("https://pricewar.store"),
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Price War Store",
    description:
      "Featured deals and everyday essentials. 644 Danforth Ave & Pape Ave, Toronto.",
    url: "/",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        {/* Theme bootstrap: set data-theme before paint to avoid flash */}
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`(function(){try{
            var mode=localStorage.getItem('pws-theme-mode')||'auto';
            var apply=function(val){document.documentElement.setAttribute('data-theme',val);};
            if(mode==='auto'){
              var mq=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)');
              var current=mq&&mq.matches?'light':'dark';
              apply(current);
              if(mq&&mq.addEventListener){mq.addEventListener('change',function(e){if((localStorage.getItem('pws-theme-mode')||'auto')==='auto'){apply(e.matches?'light':'dark');}});} 
            } else {
              var t=localStorage.getItem('pws-theme')||'dark';
              apply(t);
            }
          }catch(e){}})();`}
        </Script>
        <AuthProvider>
          <DealsProvider initialDeals={initialDeals}>
            <ProductsProvider>
              <CartProvider>
          <header className="sticky top-0 z-30">
            <PromoStrip />
            <MainNav />
          </header>

          <main className="mx-auto max-w-6xl px-4 py-6">
            <RouteTransition>
              {children}
            </RouteTransition>
          </main>

          <footer className="mt-12 border-t border-white/10 bg-[var(--surface)]">
            <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div>
                <div className="font-semibold mb-2">Price War Store</div>
                <p className="text-white/70">Delivering affordable essentials with style and convenience.</p>
              </div>
              <div>
                <div className="font-semibold mb-2">Visit Us</div>
                <p className="text-white/70">644 Danforth Ave & Pape Ave, Toronto, ON</p>
              </div>
              <div>
                <div className="font-semibold mb-2">Contact</div>
                <p className="text-white/70">(123) 456-7890 • info@pricewarstore.com</p>
              </div>
            </div>
            <div className="text-center text-xs text-white/50 pb-6"> {new Date().getFullYear()} Price War Store</div>
          </footer>
          <ChatbotLoader />
              </CartProvider>
            </ProductsProvider>
          </DealsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
