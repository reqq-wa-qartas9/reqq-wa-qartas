import React, { useState } from 'react';
import { X, Bookmark, Download, Sparkles, Check, Share2 } from 'lucide-react';

interface BookmarkGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookmarkGeneratorModal: React.FC<BookmarkGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('قارئ شغوف');
  const [quote, setQuote] = useState('اقرأ، فإن في السطور حيوات لا تنتهي وسكينة لا تزول.');
  const [theme, setTheme] = useState<'emerald' | 'parchment' | 'midnight'>('parchment');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const quotePresets = [
    'اقرأ، فإن في السطور حيوات لا تنتهي وسكينة لا تزول.',
    'العِلم صيدٌ والكتابة قيدُه، فقيّد صيدك بالحبال الواثقة.',
    'أعزّ مكان في الدُنى سرج سابح، وخير جليس في الزمان كتاب.',
    'إنما تصنع عقلك بما تطالع، فاختر لروحك أطيب الثمار.',
  ];

  const themes = {
    parchment: {
      name: 'رقّ كلاسيكي مذهب',
      bg: '#F5ECE1',
      border: '#B39265',
      text: '#2D2319',
      accent: '#8C6839',
      tag: 'bg-[#EADECE] text-[#59442C]',
    },
    emerald: {
      name: 'أندلسي زمردي فاخر',
      bg: '#113324',
      border: '#D4AF37',
      text: '#F3EFE6',
      accent: '#E6C665',
      tag: 'bg-[#184632] text-[#E7C86E]',
    },
    midnight: {
      name: 'سماء الليل العميقة',
      bg: '#171B26',
      border: '#7E9BB8',
      text: '#EBF1F7',
      accent: '#9BB8D3',
      tag: 'bg-[#222736] text-[#A6C4DF]',
    },
  };

  const currentTheme = themes[theme];

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('digital-bookmark-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `فاصلة_رق_وقرطاس_${name.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl border border-[#D9CBB8] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F4EFE6] border-b border-[#E8DFC0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2E2822] text-[#F3ECE2] flex items-center justify-center shadow-xs">
              <Bookmark className="w-4 h-4 text-[#D8C7B0]" />
            </div>
            <div>
              <h3 className="font-amiri text-xl font-bold text-[#24211E]">
                صانع الفواصل القرائية الرقمية باسمك (مجاناً)
              </h3>
              <p className="text-xs text-[#7A6E63]">
                هدية تذكارية من «رقّ وقرطاس» لترافقك في رحلتك بين صفحات الكتب
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

        {/* Form & Live Preview */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#54483C] mb-1.5">
                اكتب اسمك أو لقبك:
              </label>
              <input
                type="text"
                value={name}
                maxLength={30}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: أحمد عبد الله أو د. سارة"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D9CEBF] rounded-xl text-sm focus:outline-none focus:border-[#2E2822]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#54483C] mb-1.5">
                اختر الحكمة المفضلة لديك:
              </label>
              <div className="space-y-1.5">
                {quotePresets.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuote(q)}
                    className={`w-full text-right p-2.5 rounded-lg text-xs transition-colors cursor-pointer border ${
                      quote === q
                        ? 'bg-[#2E2822] text-white border-[#2E2822]'
                        : 'bg-white text-[#5C5042] border-[#E8DFC0] hover:bg-[#F6EFE6]'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#54483C] mb-1.5">
                طراز الفاصلة ولونها:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['parchment', 'emerald', 'midnight'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                      theme === t
                        ? 'border-[#2E2822] ring-1 ring-[#2E2822] font-bold'
                        : 'border-[#E0D5C5] bg-white text-[#665B4F]'
                    }`}
                  >
                    {themes[t].name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Bookmark Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative p-2 bg-[#EFE8DE] rounded-2xl border border-[#D9CBB8] shadow-inner">
              <svg
                id="digital-bookmark-svg"
                width="160"
                height="340"
                viewBox="0 0 160 340"
                className="rounded-xl drop-shadow-lg"
              >
                {/* Background Bookmark Card */}
                <rect
                  x="0"
                  y="0"
                  width="160"
                  height="340"
                  rx="12"
                  fill={currentTheme.bg}
                />
                
                {/* Ornate Gold Border Line */}
                <rect
                  x="7"
                  y="7"
                  width="146"
                  height="326"
                  rx="8"
                  fill="none"
                  stroke={currentTheme.border}
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />

                {/* Top Ribbon Hole / Eyelet */}
                <circle cx="80" cy="22" r="5" fill={currentTheme.border} />
                <path
                  d="M 80 0 L 80 18"
                  stroke={currentTheme.accent}
                  strokeWidth="2.5"
                />

                {/* Store Seal */}
                <text
                  x="80"
                  y="55"
                  textAnchor="middle"
                  fontFamily="Amiri"
                  fontSize="12"
                  fontWeight="bold"
                  fill={currentTheme.accent}
                >
                  رَقّ وقِرْطَاس
                </text>

                {/* Subtle Divider */}
                <line
                  x1="35"
                  y1="68"
                  x2="125"
                  y2="68"
                  stroke={currentTheme.border}
                  strokeWidth="0.8"
                />

                {/* Reader Name */}
                <text
                  x="80"
                  y="105"
                  textAnchor="middle"
                  fontFamily="Alexandria"
                  fontSize="10"
                  fill={currentTheme.accent}
                >
                  من خزانة القارئ
                </text>
                <text
                  x="80"
                  y="130"
                  textAnchor="middle"
                  fontFamily="Amiri"
                  fontSize="16"
                  fontWeight="bold"
                  fill={currentTheme.text}
                >
                  {name || 'صديق القراءة'}
                </text>

                {/* Decorative Central Motif */}
                <circle cx="80" cy="155" r="2" fill={currentTheme.border} />

                {/* Quote (wrapped text) */}
                <foreignObject x="18" y="170" width="124" height="110">
                  <div
                    style={{
                      fontFamily: 'Amiri, serif',
                      fontSize: '11px',
                      color: currentTheme.text,
                      textAlign: 'center',
                      lineHeight: '1.6',
                      direction: 'rtl',
                    }}
                  >
                    «{quote}»
                  </div>
                </foreignObject>

                {/* Bottom Signature */}
                <text
                  x="80"
                  y="315"
                  textAnchor="middle"
                  fontFamily="Alexandria"
                  fontSize="8"
                  fill={currentTheme.accent}
                  letterSpacing="1"
                >
                  reqqwaqartas.com
                </text>
              </svg>
            </div>

            <button
              onClick={handleDownloadSVG}
              className="mt-4 w-full py-2.5 px-4 bg-[#2E2822] text-[#FAF8F5] rounded-xl text-xs font-bold hover:bg-[#1E1A16] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-[#73C685]" />
                  <span>تم التنزيل بنجاح!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#D8C7B0]" />
                  <span>تحميل فاصلتك الرقمية (SVG/ملف)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
