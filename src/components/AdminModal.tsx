import React, { useState } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  BookOpen,
  Tag,
  Phone,
  Settings,
  Database,
  Download,
  Upload,
  Code,
  TrendingUp,
  Share2,
  FileSpreadsheet,
  HelpCircle,
} from 'lucide-react';
import { Product, Coupon, StoreSettings, OrderRecord } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  coupons: Coupon[];
  onUpdateCoupons: (newCoupons: Coupon[]) => void;
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  orders: OrderRecord[];
  onUpdateOrders: (newOrders: OrderRecord[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  coupons,
  onUpdateCoupons,
  settings,
  onUpdateSettings,
  orders,
  onUpdateOrders,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'coupons' | 'settings' | 'orders' | 'playbook' | 'backup'>('products');

  // Edit / Add Product Form state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Product>({
    id: '',
    title: '',
    subtitle: '',
    author: '',
    category: 'كتب رقمية',
    price: 50,
    originalPrice: 80,
    isFree: false,
    isFeatured: false,
    coverImage: '/src/assets/images/book_cover_arabic_wisdom_1793002934702.jpg',
    description: '',
    format: 'PDF تفاعلي',
    pagesOrDuration: '150 صفحة',
    readTime: '2.5 ساعة',
    sampleExcerpt: {
      chapter: 'الفصل الأول: البداية',
      text: 'اكتب هنا عينة تشويقية من الكتاب تظهر للقراء في المعاينة المجانية...',
      highlights: ['نقطة مميزة 1', 'نقطة مميزة 2', 'نقطة مميزة 3'],
    },
    downloadUrl: '',
    rating: 5.0,
    salesCount: 1,
  });

  // Coupon form state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(15);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Settings form state
  const [tempSettings, setTempSettings] = useState<StoreSettings>({ ...settings });
  const [settingsSavedFeedback, setSettingsSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === settings.adminPassword || passwordInput === 'reqq2026') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Product handlers
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title.trim()) return;

    if (productForm.id) {
      // update
      const updated = products.map((p) => (p.id === productForm.id ? productForm : p));
      onUpdateProducts(updated);
    } else {
      // create
      const newProd: Product = {
        ...productForm,
        id: `reqq-${Date.now().toString().slice(-5)}`,
      };
      onUpdateProducts([newProd, ...products]);
    }

    setIsEditingProduct(false);
  };

  const handleEditProductClick = (prod: Product) => {
    setProductForm({ ...prod });
    setIsEditingProduct(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
      onUpdateProducts(products.filter((p) => p.id !== id));
    }
  };

  // Coupon handlers
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newC: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: Number(newCouponPercent),
      description: newCouponDesc || `خصم ${newCouponPercent}%`,
      isActive: true,
    };
    onUpdateCoupons([newC, ...coupons]);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  const handleDeleteCoupon = (code: string) => {
    onUpdateCoupons(coupons.filter((c) => c.code !== code));
  };

  const handleToggleCoupon = (code: string) => {
    onUpdateCoupons(
      coupons.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Settings handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    setSettingsSavedFeedback(true);
    setTimeout(() => setSettingsSavedFeedback(false), 2500);
  };

  // Export / Import
  const handleExportData = () => {
    const data = {
      products,
      coupons,
      settings: tempSettings,
      orders,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reqq_wa_qartas_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.products) onUpdateProducts(parsed.products);
        if (parsed.coupons) onUpdateCoupons(parsed.coupons);
        if (parsed.settings) {
          onUpdateSettings(parsed.settings);
          setTempSettings(parsed.settings);
        }
        if (parsed.orders) onUpdateOrders(parsed.orders);
        alert('تم استيراد كافة البيانات بنجاح!');
      } catch (err) {
        alert('الملف غير صالح أو حدث خطأ أثناء الاستيراد');
      }
    };
    reader.readAsText(file);
  };

  // Google Sheets Apps Script Code Template
  const googleScriptTemplate = `// كود Google Apps Script لربط متجر رقّ وقرطاس بجدول Google Sheet مجاناً 100%
// طريقة الاستخدام:
// 1. افتح صفحة Google Sheets جديدة وسمّها "طلبات رقّ وقرطاس".
// 2. من القائمة العلوية اضغط Extensions (الإضافات) -> Apps Script.
// 3. الصق هذا الكود كاملاً واحفظه.
// 4. اضغط Deploy (نشر) -> New Deployment -> Web App -> اختر Anyone (أي شخص) يمكنه الوصول.
// 5. انسخ الرابط واستخدمه كـ Webhook مجاني لحفظ كل طلب يأتيك!

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // كتابة العناوين في الصف الأول إذا كان الجدول فارغاً
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["رقم الطلب", "التاريخ", "اسم العميل", "هاتف المحول", "المنتجات", "الإجمالي ج.م", "الحالة"]);
    }
    
    // إضافة بيانات الطلب الجديد
    sheet.appendRow([
      data.orderId || "REQ-" + new Date().getTime(),
      new Date().toLocaleString("ar-EG"),
      data.customerName || "غير محدد",
      data.customerPhone || "فودافون كاش",
      data.items ? data.items.map(function(i){ return i.title; }).join(", ") : "",
      data.totalAmount || 0,
      "بانتظار التحقق من الكاش"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF7F2] rounded-2xl border border-[#D9CBB8] shadow-2xl overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-[#2E2822] text-[#F3ECE2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3F362E] text-[#D8C7B0] flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-amiri text-lg font-bold text-[#FAF8F5]">
                لوحة تحكم إدارة متجر «رقّ وقرطاس»
              </h3>
              <p className="text-[11px] text-[#C2B19D]">
                إدارة الكتب الرقمية، أرقام فودافون كاش، كوبونات الخصم، ودليل التوسع بميزانية صفر
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#C2B19D] hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="إغلاق لوحة التحكم"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authentication Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center flex-1 max-w-md mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EFE8DD] text-[#2E2822] flex items-center justify-center shadow-xs">
              <Lock className="w-6 h-6 text-[#8C6D46]" />
            </div>
            <div>
              <h4 className="font-amiri text-2xl font-bold text-[#24211E]">
                منطقة الإدارة المحمية
              </h4>
              <p className="text-xs text-[#7A6E63] mt-1 leading-relaxed">
                هذه اللوحة خاصة بمالك المتجر فقط لإضافة وتعديل المنتجات والأرقام المالية.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="أدخل كلمة المرور (الافتراضية: reqq2026)"
                  className="w-full px-4 py-3 text-center bg-white border border-[#D9CEBF] rounded-xl text-sm focus:outline-none focus:border-[#2E2822]"
                />
                {authError && (
                  <p className="text-xs text-[#B93A2B] mt-1.5 font-medium">
                    كلمة المرور غير صحيحة، حاول مجدداً.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#2E2822] text-white rounded-xl text-xs font-bold hover:bg-[#1E1A16] transition-all cursor-pointer shadow-xs"
              >
                الدخول إلى لوحة الإدارة
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Tabs Header */}
            <div className="px-6 py-2 bg-[#F4EFE6] border-b border-[#E8DFC0] flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab('products');
                  setIsEditingProduct(false);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#2E2822] text-white font-bold'
                    : 'text-[#615446] hover:text-[#24211E]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>الكتب والمنتجات ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-[#2E2822] text-white font-bold'
                    : 'text-[#615446] hover:text-[#24211E]'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>الكوبونات والعروض ({coupons.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#2E2822] text-white font-bold'
                    : 'text-[#615446] hover:text-[#24211E]'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>أرقام الكاش والتواصل</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#2E2822] text-white font-bold'
                    : 'text-[#615446] hover:text-[#24211E]'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>سجل الطلبات ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('playbook')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'playbook'
                    ? 'bg-[#8C6D46] text-white font-bold'
                    : 'text-[#615446] hover:text-[#24211E]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>دليل الرفع والتوسع (ميزانية صفر)</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'backup'
                    ? 'bg-[#2E2822] text-white font-bold'
                    : 'text-[#615446] hover:text-[#24211E]'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>نسخ احتياطي واستيراد</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: PRODUCTS */}
              {activeTab === 'products' && (
                <div>
                  {!isEditingProduct ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-amiri text-lg font-bold text-[#24211E]">
                            قائمة الإصدارات والكتب الرقمية
                          </h4>
                          <p className="text-xs text-[#7A6E63]">
                            أضف كتباً جديدة أو عدل الأسعار وروابط التنزيل وروابط المعاينة
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setProductForm({
                              id: '',
                              title: '',
                              subtitle: '',
                              author: '',
                              category: 'تطوير الذات',
                              price: 60,
                              originalPrice: 90,
                              isFree: false,
                              isFeatured: false,
                              coverImage: '/src/assets/images/book_cover_arabic_wisdom_1793002934702.jpg',
                              description: '',
                              format: 'PDF تفاعلي',
                              pagesOrDuration: '180 صفحة',
                              readTime: '3 ساعات',
                              sampleExcerpt: {
                                chapter: 'الفصل الأول: البداية والإشراق',
                                text: 'اكتب نص المقتطف الذي سيقرأه الزائر في المعاينة المجانية...',
                                highlights: ['فائدة رئيسية 1', 'فائدة رئيسية 2', 'فائدة رئيسية 3'],
                              },
                              downloadUrl: 'https://drive.google.com/',
                              rating: 5.0,
                              salesCount: 1,
                            });
                            setIsEditingProduct(true);
                          }}
                          className="px-4 py-2 bg-[#2E2822] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#1E1A16] cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>إضافة كتاب جديد</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-4 bg-white rounded-xl border border-[#E8DFC0] flex items-center justify-between gap-4 shadow-2xs"
                          >
                            <img
                              src={prod.coverImage}
                              alt={prod.title}
                              referrerPolicy="no-referrer"
                              className="w-14 h-20 object-contain rounded bg-[#F8F5F0] shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] text-[#8C7A6B] font-medium">
                                {prod.category} · {prod.format}
                              </div>
                              <h5 className="font-amiri text-sm font-bold text-[#24211E] truncate">
                                {prod.title}
                              </h5>
                              <div className="text-xs text-[#5C5042] mt-0.5">
                                {prod.isFree ? (
                                  <span className="text-[#2E7D32] font-bold">مجاناً</span>
                                ) : (
                                  <span className="font-mono tabular-nums">{prod.price} ج.م</span>
                                )}
                                {prod.isFeatured && (
                                  <span className="mr-2 text-[10px] bg-[#EFE4D2] text-[#694821] px-1.5 py-0.5 rounded">
                                    متميز
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleEditProductClick(prod)}
                                className="p-2 text-[#5C5042] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
                                title="تعديل المنتج"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-2 text-[#B93A2B] hover:bg-[#FDF2F0] rounded-lg transition-colors cursor-pointer"
                                title="حذف المنتج"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Product Form */
                    <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded-2xl border border-[#E8DFC0] space-y-4">
                      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3">
                        <h4 className="font-amiri text-lg font-bold text-[#24211E]">
                          {productForm.id ? 'تعديل بيانات الكتاب' : 'إضافة كتاب رقمي جديد'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEditingProduct(false)}
                          className="text-xs text-[#7A6E63] hover:text-[#24211E]"
                        >
                          إلغاء
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#54483C] mb-1">
                            عنوان الكتاب / المنتج:
                          </label>
                          <input
                            type="text"
                            required
                            value={productForm.title}
                            onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#2E2822]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#54483C] mb-1">
                            المؤلف أو الجهة المصدرة:
                          </label>
                          <input
                            type="text"
                            required
                            value={productForm.author}
                            onChange={(e) => setProductForm({ ...productForm, author: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#2E2822]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#54483C] mb-1">
                            التصنيف:
                          </label>
                          <input
                            type="text"
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#54483C] mb-1">
                            صيغة المنتج:
                          </label>
                          <select
                            value={productForm.format}
                            onChange={(e) => setProductForm({ ...productForm, format: e.target.value as any })}
                            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg"
                          >
                            <option value="PDF تفاعلي">PDF تفاعلي</option>
                            <option value="دليل عملي">دليل عملي</option>
                            <option value="قوالب وأدوات">قوالب وأدوات</option>
                            <option value="كتاب صوتي + PDF">كتاب صوتي + PDF</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#54483C] mb-1">
                            السعر الحالي (ج.م):
                          </label>
                          <input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#54483C] mb-1">
                            السعر قبل الخصم (ج.م):
                          </label>
                          <input
                            type="number"
                            value={productForm.originalPrice}
                            onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#54483C] mb-1">
                            عدد الصفحات / المدة:
                          </label>
                          <input
                            type="text"
                            value={productForm.pagesOrDuration}
                            onChange={(e) => setProductForm({ ...productForm, pagesOrDuration: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#54483C] mb-1">
                            رابط التحميل الفوري (Google Drive / Dropbox):
                          </label>
                          <input
                            type="text"
                            value={productForm.downloadUrl}
                            onChange={(e) => setProductForm({ ...productForm, downloadUrl: e.target.value })}
                            placeholder="https://drive.google.com/..."
                            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg dir-ltr"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#54483C] mb-1">
                          وصف الكتاب الكامل:
                        </label>
                        <textarea
                          rows={2}
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg"
                        />
                      </div>

                      {/* Sample preview text */}
                      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE3D6] space-y-2">
                        <span className="text-xs font-bold text-[#4A3E31]">
                          محتوى المعاينة المجانية (الذي يظهر في القارئ التفاعلي):
                        </span>
                        <div>
                          <label className="block text-[11px] text-[#7A6E63] mb-1">عنوان الفصل:</label>
                          <input
                            type="text"
                            value={productForm.sampleExcerpt.chapter}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                sampleExcerpt: { ...productForm.sampleExcerpt, chapter: e.target.value },
                              })
                            }
                            className="w-full px-3 py-1.5 text-xs bg-white border border-[#D9CEBF] rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#7A6E63] mb-1">نص المقتطف:</label>
                          <textarea
                            rows={3}
                            value={productForm.sampleExcerpt.text}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                sampleExcerpt: { ...productForm.sampleExcerpt, text: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 text-xs bg-white border border-[#D9CEBF] rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 text-xs text-[#54483C] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.isFree}
                            onChange={(e) => setProductForm({ ...productForm, isFree: e.target.checked })}
                            className="rounded"
                          />
                          <span>جعله متاحاً مجاناً (كتاب هدية)</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs text-[#54483C] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.isFeatured}
                            onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                            className="rounded"
                          />
                          <span>تمييزه كإصدار خاص في الصفحة الرئيسية</span>
                        </label>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F2ECE4]">
                        <button
                          type="button"
                          onClick={() => setIsEditingProduct(false)}
                          className="px-4 py-2 text-xs text-[#7A6E63]"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#2E2822] text-white rounded-xl text-xs font-bold hover:bg-[#1E1A16] flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                          <Save className="w-4 h-4" />
                          <span>حفظ التعديلات ونشر المنتج</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: COUPONS */}
              {activeTab === 'coupons' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-amiri text-lg font-bold text-[#24211E]">
                      إدارة كوبونات وعروض الخصم
                    </h4>
                    <p className="text-xs text-[#7A6E63]">
                      أنشئ أكواد خصم لتوزيعها على متابعيك على يوتيوب وإنستجرام وواتساب
                    </p>
                  </div>

                  {/* Add coupon form */}
                  <form onSubmit={handleAddCoupon} className="bg-white p-4 rounded-xl border border-[#E8DFC0] flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[140px]">
                      <label className="block text-xs font-semibold text-[#54483C] mb-1">
                        رمز الكوبون:
                      </label>
                      <input
                        type="text"
                        required
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                        placeholder="مثال: YOUTUBE25"
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg uppercase font-mono"
                      />
                    </div>

                    <div className="w-28">
                      <label className="block text-xs font-semibold text-[#54483C] mb-1">
                        نسبة الخصم %:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={newCouponPercent}
                        onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg font-mono"
                      />
                    </div>

                    <div className="flex-1 min-w-[160px]">
                      <label className="block text-xs font-semibold text-[#54483C] mb-1">
                        الوصف / المناسبة:
                      </label>
                      <input
                        type="text"
                        value={newCouponDesc}
                        onChange={(e) => setNewCouponDesc(e.target.value)}
                        placeholder="مثال: خصم خاص لمتابعي قناة اليوتيوب"
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#2E2822] text-white rounded-lg text-xs font-bold hover:bg-[#1E1A16] cursor-pointer"
                    >
                      إضافة الكوبون
                    </button>
                  </form>

                  {/* Coupons list */}
                  <div className="space-y-3">
                    {coupons.map((c) => (
                      <div
                        key={c.code}
                        className="p-3 bg-white rounded-xl border border-[#E8DFC0] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold bg-[#FAF8F5] px-3 py-1 rounded border border-[#E0D5C5] text-[#2E2822]">
                            {c.code}
                          </span>
                          <div>
                            <div className="text-xs font-semibold text-[#24211E]">
                              خصم {c.discountPercent}%
                            </div>
                            <div className="text-[11px] text-[#7A6E63]">{c.description}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleCoupon(c.code)}
                            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                              c.isActive
                                ? 'bg-[#E7F3E9] text-[#2E7D32]'
                                : 'bg-[#F2EFE9] text-[#7A6E63]'
                            }`}
                          >
                            {c.isActive ? 'مفعل' : 'معطل'}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(c.code)}
                            className="p-1.5 text-[#B93A2B] hover:bg-[#FDF2F0] rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: STORE SETTINGS & CONTACTS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-[#E8DFC0] space-y-4">
                  <div className="border-b border-[#F2ECE4] pb-3">
                    <h4 className="font-amiri text-lg font-bold text-[#24211E]">
                      إعدادات المتجر وبيانات التواصل والتحويل
                    </h4>
                    <p className="text-xs text-[#7A6E63]">
                      تحديث فوري لأرقام فودافون كاش وواتساب وحسابات السوشيال ميديا
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#54483C] mb-1">
                        رقم محفظة فودافون كاش (للتحويل):
                      </label>
                      <input
                        type="text"
                        value={tempSettings.vodafoneCashNumber}
                        onChange={(e) => setTempSettings({ ...tempSettings, vodafoneCashNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg font-mono dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#54483C] mb-1">
                        رقم واتساب للتواصل واستلام الإيصالات:
                      </label>
                      <input
                        type="text"
                        value={tempSettings.whatsappNumber}
                        onChange={(e) => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg font-mono dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#54483C] mb-1">
                        البريد الإلكتروني الرسمي:
                      </label>
                      <input
                        type="email"
                        value={tempSettings.email}
                        onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg font-mono dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#54483C] mb-1">
                        رابط قناة اليوتيوب:
                      </label>
                      <input
                        type="url"
                        value={tempSettings.youtubeUrl}
                        onChange={(e) => setTempSettings({ ...tempSettings, youtubeUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg font-mono dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#54483C] mb-1">
                        رابط حساب الإنستجرام:
                      </label>
                      <input
                        type="url"
                        value={tempSettings.instagramUrl}
                        onChange={(e) => setTempSettings({ ...tempSettings, instagramUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg font-mono dir-ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#54483C] mb-1">
                        كلمة مرور لوحة الإدارة:
                      </label>
                      <input
                        type="text"
                        value={tempSettings.adminPassword}
                        onChange={(e) => setTempSettings({ ...tempSettings, adminPassword: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#54483C] mb-1">
                      شعار المتجر (Slogan):
                    </label>
                    <input
                      type="text"
                      value={tempSettings.tagline}
                      onChange={(e) => setTempSettings({ ...tempSettings, tagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F2ECE4]">
                    {settingsSavedFeedback ? (
                      <span className="text-xs text-[#2E7D32] font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        تم حفظ كافة البيانات بنجاح!
                      </span>
                    ) : <span />}

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#2E2822] text-white rounded-xl text-xs font-bold hover:bg-[#1E1A16] flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ الإعدادات</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: ORDERS LOG */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-amiri text-lg font-bold text-[#24211E]">
                        سجل طلبات العملاء عبر واتساب وفودافون كاش
                      </h4>
                      <p className="text-xs text-[#7A6E63]">
                        قائمة بالطلبات التي ضغط أصحابها لإرسالها عبر واتساب
                      </p>
                    </div>
                    {orders.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm('هل تريد مسح سجل الطلبات القديمة؟')) {
                            onUpdateOrders([]);
                          }
                        }}
                        className="text-xs text-[#B93A2B] hover:underline cursor-pointer"
                      >
                        مسح السجل
                      </button>
                    )}
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-xl border border-[#E8DFC0] text-xs text-[#7A6E63]">
                      لا توجد طلبات مسجلة حتى الآن. ستظهر الطلبات هنا فور أن يرسلها العملاء إلى الواتساب.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 bg-white rounded-xl border border-[#E8DFC0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-[#2E2822] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EDE2D4]">
                                {ord.id}
                              </span>
                              <span className="text-xs font-medium text-[#24211E]">{ord.customerName}</span>
                              <span className="text-[11px] text-[#8C7A6B]">({ord.date})</span>
                            </div>
                            <div className="text-xs text-[#5C5042]">
                              المنتجات: {ord.items.map((i) => i.title).join('، ')}
                            </div>
                            <div className="text-[11px] text-[#8C7A6B] mt-0.5">
                              المحول منه: {ord.vodafoneSenderPhone}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-left">
                              <div className="font-mono text-sm font-bold text-[#24211E]">
                                {ord.totalAmount} ج.م
                              </div>
                              <span className="text-[10px] text-[#A27B4C]">
                                {ord.discountApplied > 0 ? `خصم: ${ord.discountApplied} ج.م` : 'بدون خصم'}
                              </span>
                            </div>

                            <select
                              value={ord.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as any;
                                onUpdateOrders(
                                  orders.map((o) => (o.id === ord.id ? { ...o, status: newStatus } : o))
                                );
                              }}
                              className="text-xs p-1.5 rounded-lg border border-[#D9CEBF] bg-[#FAF8F5]"
                            >
                              <option value="بانتظار التحقق">بانتظار التحقق</option>
                              <option value="مكتمل">مكتمل</option>
                              <option value="ملغي">ملغي</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: ZERO BUDGET PLAYBOOK & SCALE ROADMAP */}
              {activeTab === 'playbook' && (
                <div className="space-y-6">
                  <div className="p-5 bg-gradient-to-r from-[#2E2822] to-[#4A3E31] text-[#FAF8F5] rounded-2xl shadow-sm">
                    <span className="text-xs text-[#D8C7B0] font-mono tracking-wider uppercase">
                      دليل رائد الأعمال الرقمي
                    </span>
                    <h4 className="font-amiri text-2xl font-bold mt-1 mb-2">
                      خطة إطلاق وتوسيع «رقّ وقرطاس» من الصفر إلى العالمية
                    </h4>
                    <p className="text-xs text-[#EAE2D5] leading-relaxed max-w-2xl">
                      هذا الدليل أعد خصيصاً لك للإجابة على سؤالك: كيف تبدأ بميزانية صفر جنيه، كيف ترفعه مجاناً على Vercel وGitHub، كيف تربطه بجوجل شيت بدون أي تكلفة، وكيف تستثمر أرباحك لاحقاً مع الحفاظ على هويتك التراثية الفخمة.
                    </p>
                  </div>

                  {/* Section 1: Free Hosting */}
                  <div className="bg-white p-5 rounded-2xl border border-[#E8DFC0] space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#24211E]">
                      <Code className="w-5 h-5 text-[#8C6D46]" />
                      <span>1. الرفع المجاني 100% على GitHub و Vercel (بدون بطاقة بنكية)</span>
                    </div>
                    <div className="text-xs text-[#5C5042] space-y-2 leading-relaxed">
                      <p>
                        <strong>الخطوة أ:</strong> افتح حساباً مجانياً على موقع <code>GitHub.com</code> وأنشئ مستودعاً جديداً (New Repository) باسم <code>reqq-wa-qartas</code>.
                      </p>
                      <p>
                        <strong>الخطوة ب:</strong> ارفع ملفات هذا المشروع (من زر Export بالأسفل أو سحب المجلد).
                      </p>
                      <p>
                        <strong>الخطوة ج:</strong> افتح موقع <code>Vercel.com</code> وسجل دخولك بضغطة زر عبر حساب GitHub.
                      </p>
                      <p>
                        <strong>الخطوة د:</strong> اختر المستودع واضغط <em>Deploy</em>. في أقل من دقيقة، سيعطيك Vercel رابطاً مجانياً سريعاً جداً ومحمياً بشهادة SSL (مثل <code>reqqwaqartas.vercel.app</code>) يعمل في كل دول العالم للأبد مجاناً!
                      </p>
                    </div>
                  </div>

                  {/* Section 2: Google Sheets Sync */}
                  <div className="bg-white p-5 rounded-2xl border border-[#E8DFC0] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#24211E]">
                        <FileSpreadsheet className="w-5 h-5 text-[#2E7D32]" />
                        <span>2. ربط المتجر بجوجل شيت (Google Sheets) كقاعدة بيانات مجانية</span>
                      </div>
                      <span className="text-[11px] bg-[#EAF5EC] text-[#2E7D32] px-2 py-0.5 rounded font-bold">
                        مجاني مدى الحياة
                      </span>
                    </div>
                    <p className="text-xs text-[#5C5042] leading-relaxed">
                      انسخ الكود البرمجي أدناه وضعه في Google Apps Script ليرسل لك كل طلبات المتجر إلى شيت إكسل سحابي تلقائياً:
                    </p>
                    <div className="relative">
                      <pre className="bg-[#1F1B16] text-[#E0D5C5] p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48 dir-ltr">
                        {googleScriptTemplate}
                      </pre>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(googleScriptTemplate);
                          alert('تم نسخ كود Google Apps Script بنجاح!');
                        }}
                        className="absolute top-2 right-2 px-2.5 py-1 bg-[#8C6D46] hover:bg-[#6E5433] text-white text-[10px] rounded cursor-pointer"
                      >
                        نسخ الكود
                      </button>
                    </div>
                  </div>

                  {/* Section 3: Revenue & Scaling Roadmap */}
                  <div className="bg-white p-5 rounded-2xl border border-[#E8DFC0] space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#24211E]">
                      <TrendingUp className="w-5 h-5 text-[#8C6D46]" />
                      <span>3. خارطة طريق التوسع المالي والأرباح (مع الحفاظ على الهوية)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE2D4]">
                        <div className="text-xs font-bold text-[#8C6D46] mb-1">المرحلة 1: الانطلاق (0 ج.م)</div>
                        <ul className="text-[11px] text-[#5C5042] space-y-1">
                          <li>• استضافة مجانية على Vercel</li>
                          <li>• الدفع بمحفظة فودافون كاش</li>
                          <li>• إرسال الروابط عبر واتساب</li>
                          <li>• محتوى يومي على YouTube و Instagram Reels باقتباسات مشوقة</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE2D4]">
                        <div className="text-xs font-bold text-[#2E7D32] mb-1">المرحلة 2: أول أرباح (1,000 ج.م)</div>
                        <ul className="text-[11px] text-[#5C5042] space-y-1">
                          <li>• شراء دومين خاص (reqqwaqartas.com) بحوالي 400-500 ج.م سنويًا</li>
                          <li>• ربط بريد رسمي باسم المتجر</li>
                          <li>• تصميم غلافين متميزين إضافيين مع كل كتاب جديد</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE2D4]">
                        <div className="text-xs font-bold text-[#24211E] mb-1">المرحلة 3: التوسع المؤسسي (10,000+ ج.م)</div>
                        <ul className="text-[11px] text-[#5C5042] space-y-1">
                          <li>• فتح حساب تاجر في Paymob أو Fawry للدفع الآلي بالفيزا</li>
                          <li>• إطلاق نادي اشتراك شهري للقراء المميزين (VIP Reader Club)</li>
                          <li>• طباعة نسخ ورقية فاخرة محدودة لمن يطلبها</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: BACKUP & RESTORE */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-amiri text-lg font-bold text-[#24211E]">
                      النسخ الاحتياطي وحفظ بيانات المتجر (JSON)
                    </h4>
                    <p className="text-xs text-[#7A6E63]">
                      احفظ نسخة من كافة منتجاتك وإعداداتك على جهازك حتى لا تفقد أي تعديل أبداً
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-white rounded-xl border border-[#E8DFC0] flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#24211E] mb-1">
                          <Download className="w-4 h-4 text-[#8C6D46]" />
                          <span>تصدير ملف النسخة الاحتياطية</span>
                        </div>
                        <p className="text-xs text-[#7A6E63] leading-relaxed">
                          قم بتنزيل ملف JSON يحتوي على جميع الكتب، الكوبونات، أرقام المحفظة، وسجل الطلبات.
                        </p>
                      </div>
                      <button
                        onClick={handleExportData}
                        className="w-full py-2.5 bg-[#2E2822] text-white rounded-lg text-xs font-bold hover:bg-[#1E1A16] cursor-pointer"
                      >
                        تحميل ملف النسخة الاحتياطية (Export JSON)
                      </button>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-[#E8DFC0] flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#24211E] mb-1">
                          <Upload className="w-4 h-4 text-[#2E7D32]" />
                          <span>استيراد واستعادة البيانات</span>
                        </div>
                        <p className="text-xs text-[#7A6E63] leading-relaxed">
                          استرجع بيانات المتجر على أي جهاز جديد أو بعد إعادة تثبيت المتصفح.
                        </p>
                      </div>
                      <label className="w-full py-2.5 bg-[#FAF8F5] border border-[#D9CBB8] text-[#2E2822] rounded-lg text-xs font-bold hover:bg-[#EDE3D6] text-center cursor-pointer block">
                        <span>اختر ملف النسخة الاحتياطية (JSON)</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
