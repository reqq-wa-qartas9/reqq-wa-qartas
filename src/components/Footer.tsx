import React from 'react';
import { Youtube, Instagram, MessageCircle, Mail, Lock, Bookmark, Smartphone } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
  onOpenBookmark: () => void;
  onOpenBundle: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onOpenBookmark,
  onOpenBundle,
}) => {
  return (
    <footer className="bg-[#24201C] text-[#E0D5C5] pt-16 pb-12 border-t border-[#3B332B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#3B332B]">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#3F362E] text-[#F3ECE2] flex items-center justify-center font-amiri text-2xl font-bold border border-[#C6B39B]/30 shadow-xs">
                ر
              </div>
              <div>
                <span className="font-amiri text-2xl font-bold tracking-tight text-[#FAF8F5] block">
                  {settings.storeName}
                </span>
                <span className="text-xs text-[#A89886] font-light">
                  خزانة الكتب والمنتجات الرقمية الراقية
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A89886] leading-relaxed max-w-sm">
              نؤمن بأن الكلمة الصادقة والفكرة العميقة تبني الحضارات وتصنع التحولات الكبرى. نوفر لك كتباً رقمية وأدلة استثنائية تصلك فوراً مع سهولة الدفع بفودافون كاش.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#362E27] hover:bg-[#8C6D46] text-[#E0D5C5] hover:text-white flex items-center justify-center transition-colors"
                aria-label="قناة رقّ وقرطاس على يوتيوب"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#362E27] hover:bg-[#8C6D46] text-[#E0D5C5] hover:text-white flex items-center justify-center transition-colors"
                aria-label="حساب رقّ وقرطاس على إنستجرام"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/2${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#362E27] hover:bg-[#25D366] text-[#E0D5C5] hover:text-white flex items-center justify-center transition-colors"
                aria-label="مراسلتنا عبر واتساب"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="w-9 h-9 rounded-lg bg-[#362E27] hover:bg-[#8C6D46] text-[#E0D5C5] hover:text-white flex items-center justify-center transition-colors"
                aria-label="مراسلتنا عبر البريد الإلكتروني"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#FAF8F5] tracking-wider uppercase font-mono">
              روابط وتجارب المتجر
            </h4>
            <ul className="space-y-2 text-xs text-[#A89886]">
              <li>
                <a href="#featured-books" className="hover:text-white transition-colors">
                  المكتبة الرقمية الكاملة
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenBundle}
                  className="hover:text-white transition-colors cursor-pointer text-right"
                >
                  مولّد باقات القراءة الذكية
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBookmark}
                  className="hover:text-white transition-colors cursor-pointer text-right"
                >
                  صانع الفواصل القرائية باسمك مجاناً
                </button>
              </li>
              <li>
                <a href="#vodafone-instructions" className="hover:text-white transition-colors">
                  خطوات التحويل بفودافون كاش
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details & Direct Numbers */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-[#FAF8F5] tracking-wider uppercase font-mono">
              بيانات التواصل والدفع الرسمي
            </h4>
            <div className="space-y-2 text-xs text-[#A89886]">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#D8C7B0] shrink-0" />
                <span>فودافون كاش: </span>
                <span className="font-mono text-white font-bold tracking-wider dir-ltr">
                  {settings.vodafoneCashNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>واتساب الطلبات: </span>
                <span className="font-mono text-white font-bold tracking-wider dir-ltr">
                  {settings.whatsappNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D8C7B0] shrink-0" />
                <span>البريد الإلكتروني: </span>
                <span className="font-mono text-white dir-ltr">{settings.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Portal Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6E63]">
          <div>
            © {new Date().getFullYear()} متجر {settings.storeName}. جميع الحقوق محفوظة لأهل القراءة والفكر.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-xs text-[#A89886] hover:text-white transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>لوحة الإدارة المحمية</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
