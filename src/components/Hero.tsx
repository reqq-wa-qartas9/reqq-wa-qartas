import React from 'react';
import { ArrowLeft, Sparkles, BookOpen, Smartphone, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenBundleClick: () => void;
  onOpenBookmarkClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onOpenBundleClick,
  onOpenBookmarkClick,
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Grid: Typography & Focal Campaign Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          {/* Right Column (in RTL): Campaign Editorial Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-right">
            {/* Top quiet kicker */}
            <div className="flex items-center gap-2 text-xs font-medium text-[#8C6D46] mb-4">
              <span>خزانة المعرفة الأصيلة</span>
              <span aria-hidden="true">·</span>
              <span>إصدارات رقمية نادرة</span>
              <span aria-hidden="true">·</span>
              <span>تسليم فوري عبر واتساب</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold text-[#24211E] leading-[1.25] tracking-tight mb-6" style={{ textWrap: 'balance' }}>
              المعرفة التي تصنع الفارق، تُقرأ بشغف وتُقتنى برقيّ
            </h1>

            {/* Subtitle / Value Proposition */}
            <p className="text-base sm:text-lg text-[#61574C] leading-relaxed mb-8 max-w-2xl font-normal">
              في متجر <strong className="font-semibold text-[#24211E]">رقّ وقرطاس</strong>، ننتقي لك أعظم الأفكار، الأدلة العملية، والقوالب الرقمية المبتكرة. اختر ما يلهمك، وحوّل بسهولة عبر <span className="font-medium text-[#24211E]">فودافون كاش</span>، لتصلك نسختك فوراً مع هدية رقمية في كل طلب.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-[#2E2822] text-[#FAF8F5] rounded-xl text-sm font-semibold hover:bg-[#1E1A16] transition-all flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span>تصفح الكتب والمنتجات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBundleClick}
                className="px-5 py-3.5 bg-white border border-[#D9CEBF] text-[#3D352B] rounded-xl text-sm font-semibold hover:bg-[#F5EFE6] hover:border-[#BFAF9C] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-[#A27B4C]" />
                <span>مولّد باقة القارئ الذكية</span>
              </button>

              <button
                onClick={onOpenBookmarkClick}
                className="text-xs font-medium text-[#8C6D46] hover:text-[#5E472A] underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
              >
                اصنع فاصلتك القرائية مجاناً
              </button>
            </div>

            {/* Proof Line */}
            <div className="flex items-center gap-4 text-xs text-[#7A6E63] pt-4 border-t border-[#EAE3D9]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3D8A52]"></span>
                <span className="font-medium text-[#24211E]">أكثر من 3,200 قارئ</span> استفادوا من إصداراتنا
              </div>
              <span aria-hidden="true">·</span>
              <div>دعم واستلام فوري خلال 5 دقائق</div>
            </div>
          </div>

          {/* Left Column (in RTL): Curated Visual Focal Asset */}
          <div className="lg:col-span-5 flex items-center">
            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden border border-[#D9CEBF]/80 shadow-md group">
              <img
                src="/src/assets/images/hero_reqq_qartas_library_1793002933850.jpg"
                alt="المكتبة الرقمية والأبحاث في رقّ وقرطاس"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-5 right-5 left-5 text-white">
                <div className="text-[11px] text-[#E7D6C0] font-mono tracking-wider uppercase mb-1">
                  روح التراث & حداثة الفكر
                </div>
                <div className="font-amiri text-xl font-bold text-[#FAF8F5]">
                  كل كتاب تجربة استثنائية تُخلّد في ذاكرتك
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Feature / Trust Row */}
        <div id="vodafone-instructions" className="mt-14 pt-10 border-t border-[#EAE3D9] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#24211E]">
              <Smartphone className="w-4 h-4 text-[#A27B4C] shrink-0" />
              <span>فودافون كاش فوري</span>
            </div>
            <p className="text-xs text-[#7A6E63] leading-relaxed">
              تحويل سهل ومباشر لأي مبلغ برقم المحفظة دون أي تعقيد بنكي.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#24211E]">
              <Zap className="w-4 h-4 text-[#A27B4C] shrink-0" />
              <span>تسليم سريع عبر واتساب</span>
            </div>
            <p className="text-xs text-[#7A6E63] leading-relaxed">
              تصلك روابط التحميل الدائمة لملفاتك فور إرسال إشعار التحويل.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#24211E]">
              <BookOpen className="w-4 h-4 text-[#A27B4C] shrink-0" />
              <span>معاينة حرة لكل كتاب</span>
            </div>
            <p className="text-xs text-[#7A6E63] leading-relaxed">
              تصفح فصولاً مختارة وعينات مجانية واطلع على المحتوى قبل الشراء.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#24211E]">
              <ShieldCheck className="w-4 h-4 text-[#A27B4C] shrink-0" />
              <span>صيغ متعددة متوافقة</span>
            </div>
            <p className="text-xs text-[#7A6E63] leading-relaxed">
              ملفات PDF عالية الدقة تناسب الهواتف، التابلت، وقارئات كيندل والكمبيوتر.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
