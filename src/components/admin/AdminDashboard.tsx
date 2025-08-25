"use client";
import { useState, useEffect, useCallback } from "react";
import { useDeals } from "@/context/DealsContext";
import DealsManager from "@/components/admin/DealsManager";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Category {
  _id: string;
  label: string;
  slug: string;
  imageUrl: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  imageUrl: string;
  description: string;
  featured: boolean;
}

// Navigation items for sidebar (Includes Deals section)
const navigationItems = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "products", label: "Products", icon: "📦" },
  { id: "categories", label: "Categories", icon: "🏷️" },
  { id: "featured", label: "Featured", icon: "⭐" },
  { id: "deals", label: "Deals", icon: "🎯" },
];

export default function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { deals, addDeal, setDeals } = useDeals();

  const [catForm, setCatForm] = useState({ label: "", slug: "", imageUrl: "" });
  const [prodForm, setProdForm] = useState({ name: "", slug: "", categorySlug: "", price: "", imageUrl: "", description: "", featured: false });
  const [dealForm, setDealForm] = useState({ title: "", description: "", category: "", expires: "" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [featuredSectionModal, setFeaturedSectionModal] = useState<{id: string, title: string, category: string} | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    featuredProducts: 0,
    activeDeals: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState({ name: "", slug: "", categorySlug: "", price: "", imageUrl: "", description: "", featured: false });

  // Predefined categories for quick access
  const predefinedCategories = [
    { slug: "electronics", label: "Electronics" },
    { slug: "hardware", label: "Hardware" },
    { slug: "clothing", label: "Clothing" },
    { slug: "luggage", label: "Luggage" },
    { slug: "bath-linen", label: "Bath Linen" },
    { slug: "household-appliances", label: "Household Appliances" },
    { slug: "utensils", label: "Utensils" },
    { slug: "bath-mats-rugs-carpets", label: "Bath Mats, Rugs & Carpets" }
  ];

  // Featured sections for home page
  const featuredSections = [
    { id: "household-appliances", category: "household-appliances", title: "Trending Gadgets & Appliances", description: "Latest household appliances and gadgets", featured: true },
    { id: "clothing", category: "clothing", title: "Fashion's Top Deals", description: "Trending fashion and clothing items", featured: true },
    { id: "bath-linen", category: "bath-linen", title: "Home Decor & Furnishings", description: "Bath linens and home decor essentials", featured: true },
    { id: "furniture", category: "furniture", title: "Furniture Deals", description: "Furniture deals and discounts", featured: true },
    { id: "clearance", category: "clearance", title: "Clearance Deals", description: "Clearance deals on various products", featured: true },
    { id: "canada-souvenir", category: "canada-souvenir", title: "Canada Souvenir", description: "Canada souvenir items", featured: true }
  ];

  async function loadCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) {
        throw new Error(`Failed to load categories: ${res.status} ${res.statusText}`);
      }
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server');
      }
      const cats = await res.json();
      if (!Array.isArray(cats)) {
        throw new Error('Invalid categories data format');
      }
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Set empty array to prevent undefined errors
      setCategories([]);
    }
  }

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error(`Failed to load products: ${res.status} ${res.statusText}`);
      }
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server');
      }
      const prods = await res.json();
      if (!Array.isArray(prods)) {
        throw new Error('Invalid products data format');
      }
      setProducts(prods);
    } catch (error) {
      console.error('Error loading products:', error);
      // Set empty array to prevent undefined errors
      setProducts([]);
    }
  }

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Main data loading function
  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [productsRes, categoriesRes, dealsRes] = await Promise.all([
        fetch('/api/products').then(res => res.ok ? res.json() : Promise.reject('Failed to fetch products')),
        fetch('/api/categories').then(res => res.ok ? res.json() : Promise.reject('Failed to fetch categories')),
        fetch('/api/deals').then(res => res.ok ? res.json() : Promise.reject('Failed to fetch deals'))
      ]);

      setProducts(productsRes);
      setCategories(categoriesRes);
      setDeals(dealsRes);

      // Update stats
      setStats({
        totalProducts: productsRes.length || 0,
        totalCategories: categoriesRes.length || 0,
        featuredProducts: productsRes.filter((p: Product) => p?.featured).length || 0,
        activeDeals: dealsRes.length || 0
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      // Reset data on error
      setProducts([]);
      setCategories([]);
      setDeals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Sensors for drag and drop (hook must not be after conditional returns)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for featured products
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const {active, over} = event;
    
    if (over && active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex(item => item.slug === active.id);
        const newIndex = items.findIndex(item => item.slug === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  // Handle save order of featured products
  const handleSaveOrder = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/featured/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: products.filter(p => p.featured).map(p => p._id)
        }),
      });
      
      if (response.ok) {
        loadAllData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating product order:', error);
    }
  }, [products, loadAllData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-300 mb-2">Error</h3>
        <p className="text-red-200">{error}</p>
        <button
          onClick={loadAllData}
          className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  async function createCategory() {
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(catForm),
    });
    setCatForm({ label: "", slug: "", imageUrl: "" });
    loadCategories();
  }

  async function deleteCategory(id: string) {
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  async function createProduct() {
    const price = parseFloat(prodForm.price);
    if (!prodForm.name || !prodForm.slug || isNaN(price)) {
      alert('Please fill out all required product fields.');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prodForm, price }),
      });

      if (res.ok) {
        alert('Product added successfully!');
        setProdForm({ name: "", slug: "", categorySlug: "", price: "", imageUrl: "", description: "", featured: false });
        // Refresh products from API
        loadProducts();
      } else {
        const errorText = await res.text();
        alert(`Failed to add product: ${errorText}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product.');
    }
  }

  async function createProductForCategory(categorySlug: string) {
    const price = parseFloat(prodForm.price);
    if (!prodForm.name || !prodForm.slug || isNaN(price)) {
      alert('Please fill out all required product fields.');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prodForm, price, categorySlug }),
      });

      if (res.ok) {
        alert('Product added successfully!');
        setProdForm({ name: "", slug: "", categorySlug: "", price: "", imageUrl: "", description: "", featured: false });
        setSelectedCategory("");
        setFeaturedSectionModal(null);
        // Refresh products from API
        loadProducts();
      } else {
        const errorText = await res.text();
        alert(`Failed to add product: ${errorText}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product.');
    }
  }

  function getProductsByCategory(categorySlug: string) {
    return products.filter(p => p.categorySlug === categorySlug);
  }

  function getFeaturedProductsByCategory(categorySlug: string) {
    return products.filter(p => p.categorySlug === categorySlug && p.featured);
  }

  async function toggleFeaturedStatus(productId: string, featured: boolean) {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured }),
      });
      if (res.ok) {
        loadProducts();
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product.');
    }
  }

  async function deleteProduct(id: string) {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Product deleted successfully!');
        loadProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product.');
    }
  }

  async function createDeal() {
    if (dealForm.title && dealForm.description && dealForm.category && dealForm.expires) {
      addDeal(dealForm);
      setDealForm({ title: "", description: "", category: "", expires: "" });
    }
  }

  async function createModalProduct() {
    if (modalProduct.name && modalProduct.slug && modalProduct.price) {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modalProduct),
      });
      if (res.ok) {
        loadProducts();
        setModalProduct({ name: "", slug: "", categorySlug: "", price: "", imageUrl: "", description: "", featured: false });
        setShowModal(false);
      }
    }
  }

  async function createFeaturedProduct() {
    if (modalProduct.name && modalProduct.slug && modalProduct.price) {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modalProduct),
      });
      if (res.ok) {
        loadProducts();
        setModalProduct({ name: "", slug: "", categorySlug: "", price: "", imageUrl: "", description: "", featured: false });
        setFeaturedSectionModal(null);
      }
    }
  }

  // Sensors and handlers defined above to respect hook order

  // Render function for the featured products section with drag and drop
  const renderFeaturedProducts = (section: { id: string; title: string; category: string }) => {
    const sectionProducts = products.filter(p => 
      p.featured && (section.category ? p.categorySlug === section.category : true)
    );

    return (
      <div key={section.id} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{section.title}</h3>
          <button 
            onClick={() => setFeaturedSectionModal(section)}
            className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            Add Product
          </button>
        </div>
        
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sectionProducts.map(p => p._id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sectionProducts.length > 0 ? (
                sectionProducts.map((product) => (
                  <SortableItem key={product._id} id={product._id}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded overflow-hidden">
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">${product.price}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveFeatured(product._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </SortableItem>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No featured products yet.</p>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    );
  };

  // Handle removing featured status
  const handleRemoveFeatured = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: false }),
      });
      
      if (response.ok) {
        loadAllData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // handleSaveOrder defined above

  // Sidebar component
  const Sidebar = () => (
    <div className="w-64 bg-[var(--surface)] border-r border-white/10 h-screen fixed left-0 top-0 z-40">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-[var(--foreground)]">Admin Dashboard</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Price War Store</p>
      </div>
      <nav className="p-3 space-y-1">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === item.id
                ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30'
                : 'text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  // Top navigation bar
  const TopNav = () => (
    <div className="h-12 bg-[var(--surface)] border-b border-white/10 fixed top-0 left-64 right-0 z-30">
      <div className="flex items-center justify-between h-full px-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)] capitalize">
            {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-[var(--muted)]">
            {new Date().toLocaleDateString()}
          </div>
          <div className="w-8 h-8 bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
            <span className="text-[var(--accent)] font-medium text-sm">A</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Card component for consistent styling
  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`card ${className}`}>
      {children}
    </div>
  );

  // Stats cards for overview
  const StatsCard = ({ title, value, icon, color = "blue" }: { title: string; value: string | number; icon: string; color?: string }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </Card>
  );

  // Render the selected section
  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title="Total Products" value={products.length} icon="📦" color="blue" />
              <StatsCard title="Categories" value={categories.length} icon="🏷️" color="green" />
              <StatsCard title="Featured Products" value={products.filter(p => p.featured).length} icon="⭐" color="yellow" />
              <StatsCard title="Active Deals" value={deals.length} icon="🎯" color="purple" />
            </div>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button 
                  onClick={() => setActiveSection("products")}
                  className="p-3 border border-white/10 rounded-lg hover:bg-white/5 text-left transition-colors"
                >
                  <div className="text-2xl mb-2">📦</div>
                  <div className="font-medium text-[var(--foreground)]">Manage Products</div>
                  <div className="text-sm text-[var(--muted)]">Add, edit, or remove products</div>
                </button>
                <button 
                  onClick={() => setActiveSection("featured")}
                  className="p-3 border border-white/10 rounded-lg hover:bg-white/5 text-left transition-colors"
                >
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="font-medium text-[var(--foreground)]">Featured Products</div>
                  <div className="text-sm text-[var(--muted)]">Manage home page sections</div>
                </button>
                <button 
                  onClick={() => setActiveSection("categories")}
                  className="p-3 border border-white/10 rounded-lg hover:bg-white/5 text-left transition-colors"
                >
                  <div className="text-2xl mb-2">🏷️</div>
                  <div className="font-medium text-[var(--foreground)]">Categories</div>
                  <div className="text-sm text-[var(--muted)]">Organize your products</div>
                </button>
              </div>
            </Card>
          </div>
        );
      case 'products':
        return (
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <input 
                  placeholder="Product Name" 
                  className="input" 
                  value={prodForm.name} 
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} 
                />
                <input 
                  placeholder="Product Slug" 
                  className="input" 
                  value={prodForm.slug} 
                  onChange={(e) => setProdForm({ ...prodForm, slug: e.target.value })} 
                />
                <input 
                  placeholder="Category Slug" 
                  className="input" 
                  value={prodForm.categorySlug} 
                  onChange={(e) => setProdForm({ ...prodForm, categorySlug: e.target.value })} 
                />
                <input 
                  placeholder="Price" 
                  type="number" 
                  className="input" 
                  value={prodForm.price} 
                  onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })} 
                />
                <input 
                  placeholder="Image URL" 
                  className="input md:col-span-2 lg:col-span-4" 
                  value={prodForm.imageUrl} 
                  onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })} 
                />
                <textarea 
                  placeholder="Description" 
                  className="input md:col-span-2 lg:col-span-4" 
                  rows={3}
                  value={prodForm.description} 
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} 
                />
                <div className="md:col-span-2 lg:col-span-4 flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="featured" 
                    checked={prodForm.featured} 
                    onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })} 
                    className="rounded"
                  />
                  <label htmlFor="featured" className="text-[var(--foreground)]">Featured Product</label>
                </div>
              </div>
              <button 
                className="mt-3 btn-accent px-5 py-2 rounded-lg transition-colors" 
                onClick={createProduct}
              >
                Add Product
              </button>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">All Products ({products.length})</h3>
              <div className="space-y-3">
                {products.map((p) => (
                  <div key={p._id} className="flex items-center gap-3 p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                        <span className="text-[var(--muted)] text-xs">No Image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-[var(--foreground)]">{p.name}</h4>
                      <p className="text-sm text-[var(--muted)]">{p.categorySlug} • ${p.price}</p>
                      <p className="text-xs text-[var(--muted)] truncate">{p.description}</p>
                    </div>
                    {p.featured && <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-1 rounded-full text-xs font-medium">Featured</span>}
                    <button 
                      onClick={() => deleteProduct(p._id)}
                      className="text-red-400 hover:text-red-300 p-2 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-center py-6 text-[var(--muted)]">
                    No products found. Add your first product above.
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
      case 'categories':
        return (
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Add New Category</h3>
              <div className="flex gap-4">
                <input 
                  placeholder="Category Label" 
                  className="flex-1 input" 
                  value={catForm.label} 
                  onChange={(e) => setCatForm({ ...catForm, label: e.target.value })} 
                />
                <input 
                  placeholder="Category Slug" 
                  className="flex-1 input" 
                  value={catForm.slug} 
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} 
                />
                <button 
                  className="btn-accent px-5 py-2 rounded-lg transition-colors" 
                  onClick={createCategory}
                >
                  Add Category
                </button>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">All Categories ({categories.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((c) => (
                  <div key={c._id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    <h4 className="font-medium text-[var(--foreground)]">{c.label}</h4>
                    <p className="text-sm text-[var(--muted)]">{c.slug}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">{products.filter(p => p.categorySlug === c.slug).length} products</p>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="col-span-full text-center py-6 text-[var(--muted)]">
                    No categories found. Add your first category above.
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
      case 'featured':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Featured Products</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setFeaturedSectionModal({ id: 'new-section', title: 'New Section', category: '' })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                >
                  <span className="mr-1">+</span> New Section
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredSections.map(section => (
                <div key={section.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      {section.title}
                      {section.category && (
                        <span className="ml-2 text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full">
                          {section.category}
                        </span>
                      )}
                    </h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setFeaturedSectionModal(section)}
                        className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center"
                        title="Edit section"
                      >
                        ✏️
                      </button>
                      <button 
                        className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center"
                        title="Delete section"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  {renderFeaturedProducts(section)}
                </div>
              ))}
            </div>
          </div>
        );
      case 'deals':
        return (
          <div className="space-y-4">
            <DealsManager title="Admin • Limited-time Offers" />
          </div>
        );
      default:
        return <div>Invalid section</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <TopNav />
      
      <main className="ml-64 pt-12 p-4">
        <div className="w-full space-y-4">
          {renderSection()}
        </div>
      </main>

      {/* Bootstrap-style Modal for Featured Products */}
      {featuredSectionModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-semibold text-[var(--foreground)]">Add Product to Featured Section</h3>
                <p className="text-sm text-[var(--muted)] mt-1">{featuredSectionModal?.title}</p>
              </div>
              <button 
                onClick={() => setFeaturedSectionModal(null)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Product Name *</label>
                    <input 
                      placeholder="Enter product name" 
                      className="w-full input" 
                      value={modalProduct.name} 
                      onChange={(e) => setModalProduct({ ...modalProduct, name: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Product Slug *</label>
                    <input 
                      placeholder="product-slug-here" 
                      className="w-full input" 
                      value={modalProduct.slug} 
                      onChange={(e) => setModalProduct({ ...modalProduct, slug: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Price *</label>
                    <input 
                      placeholder="0.00" 
                      type="number" 
                      step="0.01"
                      className="w-full input" 
                      value={modalProduct.price} 
                      onChange={(e) => setModalProduct({ ...modalProduct, price: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Category</label>
                    <input 
                      className="w-full input bg-white/5" 
                      value={modalProduct.categorySlug} 
                      disabled
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Image URL *</label>
                    <input 
                      placeholder="https://example.com/image.jpg" 
                      className="w-full input" 
                      value={modalProduct.imageUrl} 
                      onChange={(e) => setModalProduct({ ...modalProduct, imageUrl: e.target.value })} 
                    />
                    {modalProduct.imageUrl && (
                      <div className="mt-1">
                        <img 
                          src={modalProduct.imageUrl} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-lg border border-white/10"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Description *</label>
                    <textarea 
                      placeholder="Product description..." 
                      className="w-full input" 
                      rows={3}
                      value={modalProduct.description} 
                      onChange={(e) => setModalProduct({ ...modalProduct, description: e.target.value })} 
                    />
                  </div>
                  
                  <div className="p-3 bg-[var(--accent)]/10 rounded-lg border border-[var(--accent)]/20">
                    <div className="flex items-center gap-2 text-[var(--accent)]">
                      <span>⭐</span>
                      <span className="text-sm font-medium">Featured Product</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button 
                className="px-6 py-2 bg-white/10 text-[var(--foreground)] rounded-lg hover:bg-white/20 transition-colors" 
                onClick={() => setFeaturedSectionModal(null)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2 btn-accent rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={createFeaturedProduct}
                disabled={!modalProduct.name || !modalProduct.slug || !modalProduct.price || !modalProduct.imageUrl || !modalProduct.description}
              >
                Add Featured Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
