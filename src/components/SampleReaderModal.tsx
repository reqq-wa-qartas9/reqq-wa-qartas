import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, ShoppingBag, Volume2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { soundscape } from '../utils/audioPlayer';

interface SampleReaderModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const SampleReaderModal: React.FC<SampleReaderModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  if (!product) return null;

  const fontClasses = {
    normal: 'text-base sm:text-lg leading-relaxed',
    large: 'text-lg sm:text-xl leading-loose',
    xlarge: 'text-xl sm:text-2xl leading-loose',
  };

  const handleAddToCart = () => {
    soundscape.playPageTurn();
    onAddToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#FAF7F2] rounded-2xl border border-[#D9CBB8] shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header of Reader */}
        <div className="px-6 py-4 border-b border-[#E8DFC0] bg-[#F4EFE6] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2E2822] text-[#F3ECE2] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#D8C7B0]" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8C7A6B]">
                <span>المعاينة القرائية الحية</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
              </div>
              <h2 className="font-amiri text-lg font-bold text-[#24211E] truncate max-w-md">
                {product.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size toggle */}
            <div className="flex items-center gap-1 bg-white border border-[#E0D5C5] rounded-lg p-1 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded transition-colors ${fontSize === 'normal' ? 'bg-[#2E2822] text-white font-bold' : 'text-[#695D50] hover:text-[#24211E]'}`}
                title="حجم خط عادي"
              >
                أ
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded transition-colors ${fontSize === 'large' ? 'bg-[#2E2822] text-white font-bold' : 'text-[#695D50] hover:text-[#24211E]'}`}
                title="حجم خط كبير"
              >
                أ+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded transition-colors ${fontSize === 'xlarge' ? 'bg-[#2E2822] text-white font-bold' : 'text-[#695D50] hover:text-[#24211E]'}`}
                title="حجم خط أكبر"
              >
                أ++
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-[#7A6E63] hover:text-[#24211E] hover:bg-white rounded-lg transition-colors cursor-pointer"
              aria-label="إغلاق المعاينة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Content Area (Parchment book page look) */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 flex-1 bg-[radial-gradient(#EDE4D6_1px,transparent_1px)] [background-size:16px_16px] bg-[#FCFAF7]">
          {/* Chapter kicker */}
          <div className="text-center pb-4 border-b border-[#E8DFC0]/70">
            <span className="text-xs uppercase tracking-widest text-[#9C8267] font-mono">
              مقتطف من الكتاب
            </span>
            <h3 className="font-amiri text-2xl font-bold text-[#2E2822] mt-1">
              {product.sampleExcerpt.chapter}
            </h3>
            <p className="text-xs text-[#8C7A6B] mt-1">بقلم المؤلف: {product.author}</p>
          </div>

          {/* Main excerpt text with classical Arabic reading aesthetics */}
          <div className={`font-amiri text-[#2B2620] leading-relaxed text-justify ${fontClasses[fontSize]} bg-white/70 p-6 sm:p-8 rounded-xl border border-[#EFE8DC] shadow-xs`}>
            <p className="first-letter:text-2xl first-letter:font-bold">
              {product.sampleExcerpt.text}
            </p>
          </div>

          {/* Key highlights / Value in full edition */}
          <div className="bg-[#F6EFE6] p-5 rounded-xl border border-[#E5DAC8]">
            <h4 className="text-xs font-bold text-[#4D4033] mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#8C6D46]" />
              <span>ماذا ستكتشف في النسخة الكاملة من هذا الإصدار؟</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C5042]">
              {product.sampleExcerpt.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D46] mt-2 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer / Purchase Action */}
        <div className="px-6 py-4 bg-[#F4EFE6] border-t border-[#E8DFC0] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-[#8C7A6B]">سعر النسخة الرقمية:</span>
            {product.isFree ? (
              <span className="text-lg font-bold text-[#2E7D32]">مجاناً بالكامل</span>
            ) : (
              <span className="text-xl font-bold text-[#24211E] font-mono tabular-nums">
                {product.price} ج.م
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#665B4F] hover:text-[#24211E] transition-colors cursor-pointer"
            >
              متابعة التصفح
            </button>
            <button
              onClick={handleAddToCart}
              className="px-5 py-2.5 bg-[#2E2822] text-[#FAF8F5] rounded-xl text-xs font-semibold hover:bg-[#1E1A16] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#D8C7B0]" />
              <span>{product.isFree ? 'الحصول على النسخة مجاناً' : 'اقتناء النسخة الكاملة الآن'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
