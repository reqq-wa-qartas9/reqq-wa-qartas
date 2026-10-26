import React, { useState } from 'react';
import { X, Sparkles, Gift, Check, ArrowLeft, Tag } from 'lucide-react';
import { Product } from '../types';

interface MoodBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddBundleToCart: (bundleProducts: Product[], couponCode: string) => void;
}

export const MoodBundleModal: React.FC<MoodBundleModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddBundleToCart,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<'wealth' | 'wisdom' | 'peace' | 'all'>('wealth');

  if (!isOpen) return null;

  const bundles = {
    wealth: {
      title: 'باقة رواد الأعمال والحرية المالية',
      subtitle: 'كل ما تحتاجه لإطلاق أول منتج رقمي والكتابة التسويقية المقنعة',
      productIds: ['reqq-02', 'reqq-06'],
      bonusProductId: 'reqq-04',
      discountCoupon: 'REQQ20',
      discountPercent: 20,
    },
    wisdom: {
      title: 'باقة الحكمة والفكر الأندلسي العريق',
      subtitle: 'دراسة مناهج علماء الأندلس وبلاغة الخطاب الإنساني',
      productIds: ['reqq-01', 'reqq-04'],
      bonusProductId: 'reqq-03',
      discountCoupon: 'QARTAS10',
      discountPercent: 10,
    },
    peace: {
      title: 'باقة السكينة الذهنية والإنتاجية العالية',
      subtitle: 'مرشد استعادة التوازن النفسي مع نظام تخطيط رقمي يومي متكامل',
      productIds: ['reqq-03', 'reqq-05'],
      bonusProductId: 'reqq-04',
      discountCoupon: 'REQQ20',
      discountPercent: 20,
    },
    all: {
      title: 'خزانة رقّ وقرطاس الشاملة (جميع الإصدارات)',
      subtitle: 'المكتبة الرقمية الكاملة: كافة الكتب والأدلة والقوالب بنسخة واحدة',
      productIds: ['reqq-01', 'reqq-02', 'reqq-03', 'reqq-05', 'reqq-06'],
      bonusProductId: 'reqq-04',
      discountCoupon: 'REQQ20',
      discountPercent: 25,
    },
  };

  const currentBundle = bundles[selectedGoal];
  const bundleItems = products.filter((p) => currentBundle.productIds.includes(p.id));
  const bonusItem = products.find((p) => p.id === currentBundle.bonusProductId);

  const rawSum = bundleItems.reduce((acc, curr) => acc + curr.price, 0);
  const discountedPrice = Math.round(rawSum * (1 - currentBundle.discountPercent / 100));
  const totalSaved = rawSum - discountedPrice;

  const handleApplyAndAdd = () => {
    const allToAdd = bonusItem ? [...bundleItems, bonusItem] : bundleItems;
    onAddBundleToCart(allToAdd, currentBundle.discountCoupon);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl border border-[#D9CBB8] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-[#F4EFE6] border-b border-[#E8DFC0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E2822] text-[#F3ECE2] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#D8C7B0]" />
            </div>
            <div>
              <h3 className="font-amiri text-xl font-bold text-[#24211E]">
                مولّد باقة القارئ الذكية ومفاجأة رقّ وقرطاس
              </h3>
              <p className="text-xs text-[#7A6E63]">
                اختر غايتك المعرفية وسنجهز لك باقة مخصصة بخصم فوري وهدية مفاجأة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7A6E63] hover:text-[#24211E] rounded-lg cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal selector pills / tabs */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#54483C] mb-3">
              ما هو هدفك الأساسي في هذه المرحلة؟
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setSelectedGoal('wealth')}
                className={`p-3 text-right rounded-xl border text-xs transition-all cursor-pointer ${
                  selectedGoal === 'wealth'
                    ? 'bg-[#2E2822] text-white border-[#2E2822] shadow-xs'
                    : 'bg-white text-[#4A3F33] border-[#E2D7C8] hover:bg-[#F6EFE6]'
                }`}
              >
                <div className="font-bold mb-1">الثروة والأعمال</div>
                <div className="text-[11px] opacity-80">منتجات رقمية وتسويق</div>
              </button>

              <button
                onClick={() => setSelectedGoal('wisdom')}
                className={`p-3 text-right rounded-xl border text-xs transition-all cursor-pointer ${
                  selectedGoal === 'wisdom'
                    ? 'bg-[#2E2822] text-white border-[#2E2822] shadow-xs'
                    : 'bg-white text-[#4A3F33] border-[#E2D7C8] hover:bg-[#F6EFE6]'
                }`}
              >
                <div className="font-bold mb-1">الفكر والحضارة</div>
                <div className="text-[11px] opacity-80">تراث وأسرار الأندلس</div>
              </button>

              <button
                onClick={() => setSelectedGoal('peace')}
                className={`p-3 text-right rounded-xl border text-xs transition-all cursor-pointer ${
                  selectedGoal === 'peace'
                    ? 'bg-[#2E2822] text-white border-[#2E2822] shadow-xs'
                    : 'bg-white text-[#4A3F33] border-[#E2D7C8] hover:bg-[#F6EFE6]'
                }`}
              >
                <div className="font-bold mb-1">الهدوء والإنتاجية</div>
                <div className="text-[11px] opacity-80">صفاء ذهني وتخطيط</div>
              </button>

              <button
                onClick={() => setSelectedGoal('all')}
                className={`p-3 text-right rounded-xl border text-xs transition-all cursor-pointer ${
                  selectedGoal === 'all'
                    ? 'bg-[#2E2822] text-white border-[#2E2822] shadow-xs'
                    : 'bg-white text-[#4A3F33] border-[#E2D7C8] hover:bg-[#F6EFE6]'
                }`}
              >
                <div className="font-bold mb-1">الخزانة الشاملة</div>
                <div className="text-[11px] opacity-80">جميع الكتب مجتمعة</div>
              </button>
            </div>
          </div>

          {/* Bundle Showcase */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DFC0] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3">
              <div>
                <h4 className="font-amiri text-lg font-bold text-[#24211E]">
                  {currentBundle.title}
                </h4>
                <p className="text-xs text-[#7A6E63]">{currentBundle.subtitle}</p>
              </div>
              <div className="text-left shrink-0">
                <span className="inline-block bg-[#EBF5ED] text-[#2E7D32] border border-[#C5E6CB] text-xs font-bold px-2.5 py-1 rounded-md">
                  خصم {currentBundle.discountPercent}%
                </span>
              </div>
            </div>

            {/* Included products */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#5C5042]">الكتب والملفات المشمولة في الباقة:</span>
              {bundleItems.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between text-xs p-2.5 bg-[#FAF8F5] rounded-lg border border-[#EDE4D7]"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#3D8A52] shrink-0" />
                    <span className="font-medium text-[#24211E]">{prod.title}</span>
                  </div>
                  <span className="font-mono text-[#7A6E63]">{prod.price} ج.م</span>
                </div>
              ))}

              {/* Bonus Mystery Gift */}
              {bonusItem && (
                <div className="flex items-center justify-between text-xs p-3 bg-gradient-to-r from-[#F7F0E6] to-[#EFE4D2] rounded-lg border border-[#DFCEB7]">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#B87333] shrink-0 animate-bounce" />
                    <div>
                      <span className="font-bold text-[#4D361F]">هدية مجانية إضافية: </span>
                      <span className="text-[#59442F]">{bonusItem.title}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#B87333]">0 ج.م مجاناً</span>
                </div>
              )}
            </div>

            {/* Price calculation */}
            <div className="pt-3 border-t border-[#F2ECE4] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#8C7A6B]">السعر الإجمالي للباقة:</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-[#24211E]">
                    {discountedPrice} ج.م
                  </span>
                  <span className="text-sm line-through text-[#9E9082] font-mono">
                    {rawSum} ج.م
                  </span>
                </div>
              </div>
              <div className="text-left text-xs text-[#2E7D32] font-medium">
                وفرت {totalSaved} ج.م + كتاب هدية مجاناً
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 py-4 bg-[#F4EFE6] border-t border-[#E8DFC0] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#665B4F] hover:text-[#24211E] cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={handleApplyAndAdd}
            className="px-6 py-3 bg-[#2E2822] text-[#FAF8F5] rounded-xl text-xs font-bold hover:bg-[#1E1A16] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#D8C7B0]" />
            <span>إضافة الباقة للحقيبة وتطبيق الخصم الفوري</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
