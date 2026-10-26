import React, { useState } from 'react';
import { ShoppingBag, Volume2, VolumeX, Sparkles, Bookmark, ShieldCheck } from 'lucide-react';
import { soundscape } from '../utils/audioPlayer';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenBundle: () => void;
  onOpenBookmark: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenBundle,
  onOpenBookmark,
  onOpenAdmin,
}) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleToggleAudio = () => {
    const newState = soundscape.toggleAmbiance(setIsAudioPlaying);
    setIsAudioPlaying(newState);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE3D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark (Single text element in display face, whitespace-nowrap shrink-0) */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="group flex items-center gap-2.5 whitespace-nowrap">
              <div className="w-10 h-10 rounded-lg bg-[#2E2822] text-[#F3ECE2] flex items-center justify-center font-amiri text-2xl font-bold border border-[#C6B39B]/30 shadow-xs group-hover:scale-105 transition-transform">
                ر
              </div>
              <div className="flex flex-col">
                <span className="font-amiri text-2xl font-bold tracking-tight text-[#24211E] group-hover:text-[#8C6D46] transition-colors leading-none">
                  رَقّ وقِرْطَاس
                </span>
                <span className="text-[11px] text-[#8C7A6B] tracking-wider font-light mt-0.5">
                  خزانة الكتب والمنتجات الرقمية
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: 4-5 Clean Single-Line Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#5C5349]">
            <a href="#featured-books" className="hover:text-[#24211E] transition-colors whitespace-nowrap shrink-0">
              المكتبة الرقمية
            </a>
            <button
              onClick={onOpenBundle}
              className="hover:text-[#24211E] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A27B4C]" />
              باقة القارئ الذكية
            </button>
            <button
              onClick={onOpenBookmark}
              className="hover:text-[#24211E] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#A27B4C]" />
              فاصلتك المخصصة مجاناً
            </button>
            <a href="#vodafone-instructions" className="hover:text-[#24211E] transition-colors whitespace-nowrap shrink-0">
              طريقة الشراء بفودافون كاش
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action + Utility Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Ambiance Audio Toggle */}
            <button
              onClick={handleToggleAudio}
              title={isAudioPlaying ? 'إيقاف أجواء مقهى القراءة' : 'تشغيل أجواء مقهى القراءة الهادئة'}
              className={`p-2.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-2 cursor-pointer ${
                isAudioPlaying
                  ? 'bg-[#EFE7DC] border-[#A27B4C] text-[#5C4528]'
                  : 'bg-white border-[#E5DCD0] text-[#7A6E63] hover:bg-[#F5EFE6]'
              }`}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 text-[#8C6D46] animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline text-xs">
                {isAudioPlaying ? 'أجواء القراءة تعمل' : 'أجواء القراءة'}
              </span>
            </button>

            {/* Shopping Bag Button (Zone 3 Primary CTA) */}
            <button
              onClick={onOpenCart}
              className="relative px-4 py-2.5 bg-[#2E2822] text-[#F7F4EF] rounded-lg text-sm font-medium hover:bg-[#1E1A16] transition-all flex items-center gap-2 shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              aria-label="حقيبة الشراء"
            >
              <ShoppingBag className="w-4 h-4 text-[#D8C7B0]" />
              <span className="hidden sm:inline">الحقيبة</span>
              {cartCount > 0 && (
                <span className="bg-[#B93A2B] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
