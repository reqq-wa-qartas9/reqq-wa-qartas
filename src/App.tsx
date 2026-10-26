/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
} from './data/initialData';
import { Product, Coupon, StoreSettings, CartItem, OrderRecord } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { SampleReaderModal } from './components/SampleReaderModal';
import { MoodBundleModal } from './components/MoodBundleModal';
import { BookmarkGeneratorModal } from './components/BookmarkGeneratorModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { Search, Sparkles, Bookmark, Check, ShieldCheck, Heart, BookOpen } from 'lucide-react';
import { soundscape } from './utils/audioPlayer';

export default function App() {
  // Persistent state with localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('reqq_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('reqq_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('reqq_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('reqq_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('reqq_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  // Modals state
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBundleOpen, setIsBundleOpen] = useState(false);
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Quick feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('reqq_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('reqq_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('reqq_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('reqq_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('reqq_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    soundscape.playPageTurn();
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.product.id === product.id);
      if (existing) {
        return prevCart.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    showToast(`تمت إضافة «${product.title}» إلى حقيبتك!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleApplyCoupon = (code: string) => {
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive
    );
    if (found) {
      setAppliedCoupon(found);
      return { success: true, message: `تم تفعيل الكوبون! خصم ${found.discountPercent}%` };
    }
    return { success: false, message: 'عذراً، هذا الكوبون غير متاح أو منتهي الصلاحية' };
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleAddBundleToCart = (bundleProducts: Product[], couponCode: string) => {
    soundscape.playPageTurn();
    setCart((prevCart) => {
      const newItems = [...prevCart];
      bundleProducts.forEach((bp) => {
        const idx = newItems.findIndex((i) => i.product.id === bp.id);
        if (idx >= 0) {
          newItems[idx].quantity += 1;
        } else {
          newItems.push({ product: bp, quantity: 1 });
        }
      });
      return newItems;
    });

    handleApplyCoupon(couponCode);
    showToast('تمت إضافة الباقة الذكية بالكامل مع تطبيق كود الخصم!');
    setIsCartOpen(true);
  };

  const handleOrderCompleted = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Categories list
  const categories = [
    'الكل',
    'تاريخ وفكر',
    'أعمال وثروة',
    'تطوير الذات',
    'مهارات واتصال',
    'أدوات وقوالب',
    'هدايا مجانية',
  ];

  // Filtered Products
  const filteredProducts = products.filter((prod) => {
    const matchCategory =
      selectedCategory === 'الكل'
        ? true
        : selectedCategory === 'هدايا مجانية'
        ? prod.isFree
        : prod.category === selectedCategory;

    const matchSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const cartTotalCount = cart.reduce((total, i) => total + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#24211E]">
      {/* Promotional Top Notification Banner (Single slim row, <= 40px) */}
      <div className="bg-[#2E2822] text-[#F3ECE2] py-2 px-4 text-center text-xs font-medium border-b border-[#3E352C] flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D8C7B0] shrink-0" />
        <span>
          مرحباً بك في خزانة <strong>رقّ وقرطاس</strong>! استخدم كود{' '}
          <code className="bg-[#42372C] px-1.5 py-0.5 rounded text-white font-mono font-bold">
            QARTAS10
          </code>{' '}
          لخصم 10% فوري عند التحويل عبر فودافون كاش
        </span>
      </div>

      {/* Main Header */}
      <Header
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBundle={() => setIsBundleOpen(true)}
        onOpenBookmark={() => setIsBookmarkOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('featured-books');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenBundleClick={() => setIsBundleOpen(true)}
          onOpenBookmarkClick={() => setIsBookmarkOpen(true)}
        />

        {/* Featured Store Section */}
        <section id="featured-books" className="py-14 border-t border-[#EAE3D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D46] mb-1">
                  <span>المقتنيات الرقمية المتاحة</span>
                  <span aria-hidden="true">·</span>
                  <span>تحميل مباشر</span>
                </div>
                <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#24211E]">
                  خزانة الإصدارات والكتب المختارة
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6E63] mt-1 max-w-xl">
                  تصفح فصول كل كتاب واقرأ عينة مجانية قبل الشراء. استلم ملفاتك فوراً عبر الواتساب بدفع فودافون كاش.
                </p>
              </div>

              {/* Search Bar Input */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن كتاب أو موضوع أو مؤلف..."
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#D9CEBF] rounded-xl text-xs text-[#24211E] placeholder:text-[#A09284] focus:outline-none focus:border-[#2E2822] shadow-2xs"
                />
                <Search className="w-4 h-4 text-[#8C7A6B] absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Category Filter Tabs (Interactive segmented control, not pills) */}
            <div className="flex items-center gap-1.5 pb-6 overflow-x-auto border-b border-[#EAE3D9] mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#2E2822] text-white shadow-xs font-semibold'
                      : 'bg-white text-[#5C5349] border border-[#E2D7C8] hover:bg-[#F5EFE6] hover:text-[#24211E]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Cards Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DFC0] p-8">
                <BookOpen className="w-12 h-12 text-[#8C7A6B] mx-auto mb-3 stroke-1" />
                <h3 className="font-amiri text-xl font-bold text-[#24211E]">
                  لم نجد إصدارات مطابقة لبحثك
                </h3>
                <p className="text-xs text-[#7A6E63] mt-1">
                  جرب البحث بكلمة أخرى أو اختر تصنيفاً مختلفاً من القائمة أعلاه.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('الكل');
                  }}
                  className="mt-4 px-4 py-2 bg-[#2E2822] text-white rounded-xl text-xs font-semibold hover:bg-[#1E1A16]"
                >
                  إعادة ضبط البحث
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                  const isAdded = cart.some((i) => i.product.id === product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onPreview={(p) => setPreviewProduct(p)}
                      onAddToCart={(p) => handleAddToCart(p)}
                      isAdded={isAdded}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Creative Interactive Feature: Reader Sanctuary & Bookmark Generator Banner */}
        <section className="py-14 bg-gradient-to-b from-[#FAF8F5] via-[#F3ECE2] to-[#FAF8F5] border-t border-[#EAE3D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#2E2822] text-[#FAF8F5] rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-[#D8C7B0] font-mono tracking-wider uppercase">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>هدية رمزية خاصة بكل زائر لمتجر رقّ وقرطاس</span>
                  </div>
                  <h3 className="font-amiri text-3xl sm:text-4xl font-bold text-white leading-tight">
                    اصنع فاصلتك القرائية المخصصة باسمك مجاناً
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D5C6B3] max-w-xl leading-relaxed">
                    تقديرًا لشغفك بالقراءة، صممنا لك أداة حصرية لتوليد فواصل كتب رقمية فاخرة بالخطوط والزخارف الأندلسية والمذهبة، تحمل اسمك وحكمتك المفضلة، لتطبعها أو تحفظها على هاتفك بدون أي مقابل.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setIsBookmarkOpen(true)}
                      className="px-6 py-3 bg-[#FAF8F5] text-[#2E2822] rounded-xl text-xs font-bold hover:bg-white transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-[#8C6D46]" />
                      <span>توليد فاصلتي الرقمية الآن مجاناً</span>
                    </button>
                    <button
                      onClick={() => setIsBundleOpen(true)}
                      className="px-5 py-3 border border-[#C6B39B]/50 text-[#F5ECE1] rounded-xl text-xs font-medium hover:bg-white/10 transition-all cursor-pointer"
                    >
                      توليد باقة القارئ الذكية
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 flex justify-center">
                  <div className="w-44 h-72 rounded-2xl bg-gradient-to-b from-[#113324] to-[#0A2218] border-2 border-[#D4AF37] p-4 flex flex-col justify-between items-center text-center shadow-xl transform rotate-2 hover:rotate-0 transition-transform">
                    <div className="w-3 h-3 rounded-full bg-[#D4AF37] mb-2" />
                    <span className="font-amiri text-xs text-[#E6C665] font-bold">
                      رَقّ وقِرْطَاس
                    </span>
                    <div className="font-amiri text-sm font-bold text-white my-auto px-2 leading-relaxed">
                      «العلمُ نورٌ والكتبُ مسالكُ الحكماء»
                    </div>
                    <span className="text-[10px] text-[#A2C7B4] tracking-wider">
                      فاصلة قرائية مخصصة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBookmark={() => setIsBookmarkOpen(true)}
        onOpenBundle={() => setIsBundleOpen(true)}
      />

      {/* Interactive Modals */}
      <SampleReaderModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      <MoodBundleModal
        isOpen={isBundleOpen}
        onClose={() => setIsBundleOpen(false)}
        products={products}
        onAddBundleToCart={handleAddBundleToCart}
      />

      <BookmarkGeneratorModal
        isOpen={isBookmarkOpen}
        onClose={() => setIsBookmarkOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        settings={settings}
        onOrderCompleted={handleOrderCompleted}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProducts={setProducts}
        coupons={coupons}
        onUpdateCoupons={setCoupons}
        settings={settings}
        onUpdateSettings={setSettings}
        orders={orders}
        onUpdateOrders={setOrders}
      />

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2E2822] text-[#FAF8F5] px-5 py-3 rounded-xl shadow-lg border border-[#C6B39B]/30 flex items-center gap-2.5 text-xs font-medium animate-fade-in">
          <Check className="w-4 h-4 text-[#73C685] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
