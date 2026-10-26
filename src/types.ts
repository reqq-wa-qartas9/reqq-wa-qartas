export interface Product {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  price: number;
  originalPrice: number;
  isFree?: boolean;
  isFeatured?: boolean;
  coverImage: string;
  description: string;
  format: 'PDF تفاعلي' | 'قوالب وأدوات' | 'كتاب صوتي + PDF' | 'دليل عملي';
  pagesOrDuration: string;
  readTime: string;
  sampleExcerpt: {
    chapter: string;
    text: string;
    highlights: string[];
  };
  downloadUrl: string;
  rating: number;
  salesCount: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  vodafoneCashNumber: string;
  whatsappNumber: string;
  email: string;
  youtubeUrl: string;
  instagramUrl: string;
  freeShippingNote: string;
  adminPassword: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: { title: string; price: number }[];
  totalAmount: number;
  discountApplied: number;
  vodafoneSenderPhone: string;
  status: 'بانتظار التحقق' | 'مكتمل' | 'ملغي';
}
