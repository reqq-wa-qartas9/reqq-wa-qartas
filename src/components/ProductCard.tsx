import React, { useState } from 'react';
import { BookOpen, Plus, Check, Star, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { soundscape } from '../utils/audioPlayer';

interface ProductCardProps {
  product: Product;
  onPreview: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isAdded: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPreview,
  onAddToCart,
  isAdded,
}) => {
  const [imgError, setImgError] = useState(false);

  const handlePreview = () => {
    soundscape.playPageTurn();
    onPreview(product);
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#E8DFC0]/70 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full">
      {/* Cover Image Container (takes ~65% visual weight on neutral backdrop) */}
      <div className="relative aspect-[3/4] bg-[#F4EFEA] overflow-hidden flex items-center justify-center p-4">
        {!imgError ? (
          <img
            src={product.coverImage}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain drop-shadow-md group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-[#EAE2D5] to-[#D5C6B2] text-[#42372A] rounded-lg">
            <BookOpen className="w-12 h-12 mb-3 text-[#8A7156] stroke-1" />
            <span className="font-amiri text-lg font-bold">{product.title}</span>
            <span className="text-xs text-[#6F604F] mt-1">{product.author}</span>
          </div>
        )}

        {/* Quiet top corner indicator if free or featured */}
        {product.isFree ? (
          <div className="absolute top-3 right-3 bg-[#2E2822] text-[#FAF8F5] text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wider">
            هدية مجانية
          </div>
        ) : product.isFeatured ? (
          <div className="absolute top-3 right-3 bg-[#A27B4C] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wider">
            إصدار متميز
          </div>
        ) : null}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-[#24211E]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={handlePreview}
            className="px-4 py-2.5 bg-white text-[#24211E] rounded-xl text-xs font-semibold shadow-lg hover:bg-[#FAF8F5] transition-all flex items-center gap-2 cursor-pointer transform translate-y-2 group-hover:translate-y-0 duration-200"
          >
            <BookOpen className="w-4 h-4 text-[#A27B4C]" />
            <span>تصفح عينة من الكتاب</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata (Strict zero-pill discipline) */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Metadata line with subtle bullet separators */}
          <div className="flex items-center gap-2 text-xs text-[#8C7A6B] mb-2 font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.format}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-mono">{product.pagesOrDuration}</span>
          </div>

          {/* Book Title */}
          <h3 className="font-amiri text-lg font-bold text-[#24211E] leading-snug group-hover:text-[#8C6D46] transition-colors mb-1.5">
            {product.title}
          </h3>

          {/* Subtitle / Description excerpt */}
          <p className="text-xs text-[#6B5F52] leading-relaxed line-clamp-2 mb-3">
            {product.subtitle || product.description}
          </p>

          {/* Author line */}
          <div className="text-xs text-[#8C7A6B] mb-4">
            بقلم: <span className="font-medium text-[#40372F]">{product.author}</span>
          </div>
        </div>

        {/* Price Baseline & Purchase Affordance */}
        <div className="pt-3 border-t border-[#F2ECE4] flex items-center justify-between gap-3">
          {/* Pricing */}
          <div className="flex flex-col">
            {product.isFree ? (
              <span className="text-base font-bold text-[#2E7D32]">مجاناً بالكامل</span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-[#24211E] font-mono tabular-nums">
                  {product.price} <span className="text-xs font-normal font-sans">ج.م</span>
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-[#9E9082] line-through font-mono tabular-nums">
                    {product.originalPrice} ج.م
                  </span>
                )}
              </div>
            )}
            <span className="text-[11px] text-[#A09284]">
              {product.isFree ? 'تحميل مباشر بدون رسوم' : 'خصم فودافون كاش متاح'}
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={() => onAddToCart(product)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              isAdded
                ? 'bg-[#E7F3E9] text-[#2E7D32] border border-[#BDE3C2]'
                : product.isFree
                ? 'bg-[#F2EFE9] text-[#3D352B] hover:bg-[#EAE4D9]'
                : 'bg-[#2E2822] text-[#FAF8F5] hover:bg-[#1E1A16] shadow-xs'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>في الحقيبة</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{product.isFree ? 'اقتناء مجاني' : 'إضافة للحقيبة'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
