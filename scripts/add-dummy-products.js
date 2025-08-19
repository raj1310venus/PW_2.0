// Script to add dummy products to all categories
const dummyProducts = [
  // Electronics
  {
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    categorySlug: "electronics",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    featured: true
  },
  {
    name: "4K Ultra HD Smart TV",
    slug: "4k-ultra-hd-smart-tv",
    categorySlug: "electronics",
    price: 599.99,
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    description: "55-inch 4K Smart TV with HDR support and built-in streaming apps.",
    featured: false
  },
  {
    name: "Gaming Mechanical Keyboard",
    slug: "gaming-mechanical-keyboard",
    categorySlug: "electronics",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
    description: "RGB backlit mechanical keyboard with blue switches for gaming.",
    featured: true
  },

  // Hardware
  {
    name: "Cordless Power Drill Set",
    slug: "cordless-power-drill-set",
    categorySlug: "hardware",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
    description: "18V cordless drill with 2 batteries and 50-piece accessory kit.",
    featured: true
  },
  {
    name: "Professional Tool Set",
    slug: "professional-tool-set",
    categorySlug: "hardware",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop",
    description: "Complete 120-piece tool set with carrying case for home and professional use.",
    featured: false
  },
  {
    name: "LED Work Light",
    slug: "led-work-light",
    categorySlug: "hardware",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    description: "Portable LED work light with magnetic base and adjustable stand.",
    featured: false
  },

  // Clothing
  {
    name: "Classic Denim Jacket",
    slug: "classic-denim-jacket",
    categorySlug: "clothing",
    price: 69.99,
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    description: "Vintage-style denim jacket with classic fit and premium cotton blend.",
    featured: true
  },
  {
    name: "Comfortable Running Shoes",
    slug: "comfortable-running-shoes",
    categorySlug: "clothing",
    price: 99.99,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    description: "Lightweight running shoes with breathable mesh and cushioned sole.",
    featured: true
  },
  {
    name: "Cotton Casual T-Shirt",
    slug: "cotton-casual-t-shirt",
    categorySlug: "clothing",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    description: "100% organic cotton t-shirt in various colors and sizes.",
    featured: false
  },

  // Luggage
  {
    name: "Hard Shell Carry-On Suitcase",
    slug: "hard-shell-carry-on-suitcase",
    categorySlug: "luggage",
    price: 159.99,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    description: "Durable hard shell suitcase with 360° spinner wheels and TSA lock.",
    featured: true
  },
  {
    name: "Travel Backpack 40L",
    slug: "travel-backpack-40l",
    categorySlug: "luggage",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    description: "Versatile travel backpack with multiple compartments and laptop sleeve.",
    featured: false
  },
  {
    name: "Leather Weekend Duffle Bag",
    slug: "leather-weekend-duffle-bag",
    categorySlug: "luggage",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    description: "Premium leather duffle bag perfect for weekend trips and gym use.",
    featured: false
  },

  // Bath & Linen
  {
    name: "Luxury Bath Towel Set",
    slug: "luxury-bath-towel-set",
    categorySlug: "bath-linen",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987ba4dbc2?w=400&h=400&fit=crop",
    description: "Premium 100% cotton towel set including bath, hand, and wash towels.",
    featured: true
  },
  {
    name: "Egyptian Cotton Bed Sheets",
    slug: "egyptian-cotton-bed-sheets",
    categorySlug: "bath-linen",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    description: "Luxurious Egyptian cotton bed sheet set with deep pocket fitted sheet.",
    featured: true
  },
  {
    name: "Bamboo Shower Curtain",
    slug: "bamboo-shower-curtain",
    categorySlug: "bath-linen",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987ba4dbc2?w=400&h=400&fit=crop",
    description: "Eco-friendly bamboo fiber shower curtain with water-resistant coating.",
    featured: false
  },

  // Household Appliances
  {
    name: "Stainless Steel Coffee Maker",
    slug: "stainless-steel-coffee-maker",
    categorySlug: "household-appliances",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    description: "Programmable coffee maker with thermal carafe and auto-brew timer.",
    featured: true
  },
  {
    name: "High-Speed Blender",
    slug: "high-speed-blender",
    categorySlug: "household-appliances",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop",
    description: "Professional-grade blender with multiple speed settings and pulse function.",
    featured: true
  },
  {
    name: "Air Fryer Oven",
    slug: "air-fryer-oven",
    categorySlug: "household-appliances",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    description: "Multi-function air fryer oven with convection cooking and digital controls.",
    featured: false
  },

  // Utensils
  {
    name: "Professional Chef Knife Set",
    slug: "professional-chef-knife-set",
    categorySlug: "utensils",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop",
    description: "High-carbon steel knife set with ergonomic handles and wooden block.",
    featured: true
  },
  {
    name: "Stainless Steel Cookware Set",
    slug: "stainless-steel-cookware-set",
    categorySlug: "utensils",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    description: "10-piece stainless steel cookware set with tri-ply construction.",
    featured: false
  },
  {
    name: "Silicone Kitchen Utensil Set",
    slug: "silicone-kitchen-utensil-set",
    categorySlug: "utensils",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop",
    description: "Heat-resistant silicone utensils with stainless steel handles.",
    featured: false
  },

  // Bath Mats, Rugs & Carpets
  {
    name: "Memory Foam Bath Mat",
    slug: "memory-foam-bath-mat",
    categorySlug: "bath-mats-rugs-carpets",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    description: "Ultra-soft memory foam bath mat with non-slip backing.",
    featured: true
  },
  {
    name: "Persian Style Area Rug",
    slug: "persian-style-area-rug",
    categorySlug: "bath-mats-rugs-carpets",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    description: "Traditional Persian-style area rug with intricate patterns and rich colors.",
    featured: true
  },
  {
    name: "Modern Geometric Carpet",
    slug: "modern-geometric-carpet",
    categorySlug: "bath-mats-rugs-carpets",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    description: "Contemporary geometric pattern carpet perfect for modern living spaces.",
    featured: false
  }
];

// Function to add products via API
async function addDummyProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  for (const product of dummyProducts) {
    try {
      const response = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      
      if (response.ok) {
        console.log(`✅ Added product: ${product.name}`);
      } else {
        console.error(`❌ Failed to add product: ${product.name}`);
      }
    } catch (error) {
      console.error(`❌ Error adding product ${product.name}:`, error);
    }
  }
}

// Export for use in other scripts
module.exports = { dummyProducts, addDummyProducts };

// Run if called directly
if (require.main === module) {
  addDummyProducts();
}
