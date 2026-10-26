import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowLeft, Copy, Check, Tag, Smartphone, MessageCircle, ShieldCheck } from 'lucide-react';
import { CartItem, Coupon, StoreSettings, OrderRecord } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
  settings: StoreSettings;
  onOrderCompleted: (order: OrderRecord) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  settings,
  onOrderCompleted,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isCopiedVodafone, setIsCopiedVodafone] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round((rawSubtotal * appliedCoupon.discountPercent) / 100) : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = onApplyCoupon(couponCode.trim());
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setCouponCode('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  const handleCopyVodafone = () => {
    navigator.clipboard.writeText(settings.vodafoneCashNumber);
    setIsCopiedVodafone(true);
    setTimeout(() => setIsCopiedVodafone(false), 2500);
  };

  const generateWhatsAppMessage = () => {
    const itemsList = items
      .map((item) => `• ${item.product.title} (الكمية: ${item.quantity}) - ${item.product.price * item.quantity} ج.م`)
      .join('\n');

    let msg = `*طلب جديد من متجر رقّ وقرطاس للكتب والمنتجات الرقمية* 📚✨\n\n`;
    if (customerName) msg += `👤 اسم العميل: ${customerName}\n`;
    if (customerPhone) msg += `📱 رقم المحول منه: ${customerPhone}\n`;
    msg += `\n*قائمة المنتجات المطلوبة:*\n${itemsList}\n\n`;
    msg += `💳 الإجمالي بعد الخصم: *${finalTotal} ج.م*\n`;
    if (appliedCoupon) {
      msg += `🎟️ الكوبون المستخدم: ${appliedCoupon.code} (خصم ${appliedCoupon.discountPercent}%)\n`;
    }
    msg += `\n📥 تم التحويل إلى محفظة فودافون كاش: *${settings.vodafoneCashNumber}*\n`;
    msg += `📎 مرفق لكم صورة إشعار التحويل لاستلام روابط التحميل الفورية. شكرًا لكم!`;

    return encodeURIComponent(msg);
  };

  const handleProceedWhatsApp = () => {
    // Record order locally
    const newOrder: OrderRecord = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('ar-EG'),
      customerName: customerName || 'قارئ رقّ وقرطاس',
      customerPhone: customerPhone || 'غير محدد',
      items: items.map((i) => ({ title: i.product.title, price: i.product.price * i.quantity })),
      totalAmount: finalTotal,
      discountApplied: discountAmount,
      vodafoneSenderPhone: customerPhone || 'عبر فودافون كاش',
      status: 'بانتظار التحقق',
    };
    onOrderCompleted(newOrder);

    // Launch WhatsApp
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/2${cleanPhone}?text=${generateWhatsAppMessage()}`;
    window.open(waUrl, '_blank');
    setOrderConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] h-full shadow-2xl flex flex-col border-l border-[#D9CBB8]">
        {/* Top Header */}
        <div className="px-6 py-5 bg-[#F4EFE6] border-b border-[#E8DFC0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="font-amiri text-xl font-bold text-[#24211E]">
              حقيبة الكتب والطلبات
            </h3>
            <span className="text-xs bg-[#2E2822] text-[#FAF8F5] px-2 py-0.5 rounded-full font-mono">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7A6E63] hover:text-[#24211E] rounded-lg transition-colors cursor-pointer"
            aria-label="إغلاق السلة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {orderConfirmed ? (
          <div className="p-8 flex flex-col items-center justify-center text-center flex-1 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E7F3E9] text-[#2E7D32] flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="font-amiri text-2xl font-bold text-[#24211E]">
              تم توجيه طلبك بنجاح عبر الواتساب!
            </h4>
            <p className="text-xs text-[#6B5F52] leading-relaxed max-w-xs">
              شكراً لاختيارك <strong className="text-[#24211E]">رقّ وقرطاس</strong>. بعد إرسال صورة إيصال فودافون كاش على واتساب، سيصلك رابط تحميل كافة ملفاتك فوراً.
            </p>
            <div className="pt-4 flex flex-col gap-2 w-full">
              <button
                onClick={() => {
                  setOrderConfirmed(false);
                  onClearCart();
                  onClose();
                }}
                className="w-full py-3 bg-[#2E2822] text-white rounded-xl text-xs font-bold hover:bg-[#1E1A16] cursor-pointer"
              >
                العودة ومتابعة التصفح
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-center flex-1 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#EFE8DD] text-[#8C7A6B] flex items-center justify-center">
              <X className="w-8 h-8 stroke-1" />
            </div>
            <h4 className="font-amiri text-xl font-bold text-[#24211E]">
              حقيبتك فارغة حالياً
            </h4>
            <p className="text-xs text-[#7A6E63] max-w-xs leading-relaxed">
              تصفح مكتبتنا الرقمية واختر الكتب أو القوالب التي تود اقتناءها.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2.5 bg-[#2E2822] text-white rounded-xl text-xs font-semibold hover:bg-[#1E1A16] cursor-pointer"
            >
              استعراض الكتب الآن
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* List of items */}
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3 bg-white rounded-xl border border-[#E8DFC0] flex items-center justify-between gap-3 shadow-2xs"
                >
                  <img
                    src={product.coverImage}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-16 object-contain rounded bg-[#F6EFE6] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-amiri text-sm font-bold text-[#24211E] truncate">
                      {product.title}
                    </h5>
                    <div className="text-[11px] text-[#8C7A6B]">
                      {product.isFree ? (
                        <span className="text-[#2E7D32] font-semibold">مجاناً</span>
                      ) : (
                        <span className="font-mono tabular-nums">{product.price} ج.م</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!product.isFree && (
                      <div className="flex items-center border border-[#E0D5C5] rounded-lg bg-[#FAF8F5] text-xs">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:text-[#24211E] cursor-pointer"
                          aria-label="إنقاص الكمية"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono tabular-nums">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:text-[#24211E] cursor-pointer"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="p-1.5 text-[#B93A2B] hover:bg-[#FDF2F0] rounded-lg transition-colors cursor-pointer"
                      aria-label="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="bg-white p-4 rounded-xl border border-[#E8DFC0] space-y-3">
              <label className="block text-xs font-semibold text-[#54483C]">
                كوبون الخصم أو الهدية:
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#EAF5EC] rounded-lg text-xs text-[#2E7D32] border border-[#C5E6CB]">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span className="font-bold">{appliedCoupon.code}</span>
                    <span>(خصم {appliedCoupon.discountPercent}%)</span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-xs text-[#B93A2B] hover:underline cursor-pointer"
                  >
                    إلغاء الكوبون
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="كود الخصم (مثال: QARTAS10)"
                    className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#2E2822] uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2E2822] text-white text-xs font-semibold rounded-lg hover:bg-[#1E1A16] cursor-pointer"
                  >
                    تطبيق
                  </button>
                </form>
              )}
              {couponFeedback && (
                <div
                  className={`text-[11px] ${
                    couponFeedback.type === 'success' ? 'text-[#2E7D32]' : 'text-[#B93A2B]'
                  }`}
                >
                  {couponFeedback.message}
                </div>
              )}
            </div>

            {/* Vodafone Cash Wallet Highlight Box */}
            <div className="bg-gradient-to-br from-[#FFF9F3] to-[#FBF1E6] p-4 rounded-xl border border-[#E7D6C1] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#24211E]">
                  <Smartphone className="w-4 h-4 text-[#D8232A]" />
                  <span>محفظة فودافون كاش للدفع</span>
                </div>
                <span className="text-[11px] text-[#A27B4C] font-semibold">تحويل فوري</span>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#E8DFC0]">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#8C7A6B]">رقم المحفظة المعتمد:</span>
                  <span className="font-mono text-base font-bold text-[#24211E] tracking-wider dir-ltr">
                    {settings.vodafoneCashNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyVodafone}
                  className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE2D5] border border-[#D9CBB8] rounded-md text-xs font-medium text-[#2E2822] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {isCopiedVodafone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الرقم</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-[#6E6050] space-y-1">
                <p>1. انسخ الرقم وأرسل المبلغ الإجمالي ({finalTotal} ج.م) عبر كاش.</p>
                <p>2. اضغط زر الواتساب أدناه وأرسل صورة الإيصال لتفعيل روابط التحميل فوراً.</p>
              </div>
            </div>

            {/* Optional Customer info for seamless order message */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#54483C]">
                بيانات المستلم (اختيارية لتسريع التفعيل):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="اسمك الكريم"
                  className="px-3 py-2 text-xs bg-white border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#2E2822]"
                />
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="رقم محفظتك المحول منها"
                  className="px-3 py-2 text-xs bg-white border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#2E2822]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Sticky Checkout Bottom Bar */}
        {!orderConfirmed && items.length > 0 && (
          <div className="p-6 bg-[#F4EFE6] border-t border-[#E8DFC0] space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#7A6E63]">
                <span>المجموع الأولي:</span>
                <span className="font-mono tabular-nums">{rawSubtotal} ج.م</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#2E7D32] font-medium">
                  <span>الخصم المطبق ({appliedCoupon?.discountPercent}%):</span>
                  <span className="font-mono tabular-nums">-{discountAmount} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#24211E] pt-2 border-t border-[#E8DFC0]">
                <span>الإجمالي المطلوب دفعه:</span>
                <span className="font-mono text-lg tabular-nums text-[#2E2822]">
                  {finalTotal} ج.م
                </span>
              </div>
            </div>

            {/* WhatsApp Checkout CTA */}
            <button
              onClick={handleProceedWhatsApp}
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>إرسال الطلب واستلام الكتب عبر واتساب</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A6E63]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D8A52]" />
              <span>ضمان تسليم فوري وروابط تحميل آمنة مدى الحياة</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
