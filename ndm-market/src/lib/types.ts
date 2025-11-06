export type LocaleCode = 'uz' | 'ru';

export interface LocalizedText {
  uz: string;
  ru: string;
}

export interface SeoMeta {
  title: LocalizedText;
  description: LocalizedText;
  keywords?: string[];
  ogImage?: string;
  lastUpdated?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = 'active' | 'hidden';
export type ProductAvailability = 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder';

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  stock: number;
  categoryId: string;
  brandId: string;
  images: string[];
  status: ProductStatus;
  attributes?: Record<string, string>;
  tags?: string[];
  seo?: SeoMeta;
  featured?: boolean;
  availability: ProductAvailability;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: LocalizedText;
  sku: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminStatus = 'active' | 'inactive' | 'suspended';
export type AdminRole = 'superadmin' | 'manager' | 'editor';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  status: AdminStatus;
  permissions: string[];
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  image: string;
  link: string;
  alt: LocalizedText;
  title: LocalizedText;
  subtitle?: LocalizedText;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeoPageMeta {
  id: string;
  path: string;
  title: LocalizedText;
  description: LocalizedText;
  keywords?: string[];
  ogImage?: string;
  lastUpdated?: string;
}

export interface SeoSettings {
  pages: SeoPageMeta[];
  sitemap: {
    enabled: boolean;
    includeAdmin: boolean;
    lastGeneratedAt: string | null;
  };
}

export interface CompanySettings {
  name: string;
  legalName: string;
  description: LocalizedText;
  locations: Array<{
    label: LocalizedText;
    address: string;
    coordinates?: { lat: number; lng: number };
  }>;
  contact: {
    phonePrimary: string;
    phoneSecondary?: string;
    email: string;
    telegram?: string;
    workingHours?: LocalizedText;
  };
}

export interface LanguageSettings {
  code: LocaleCode;
  label: string;
  default?: boolean;
}

export interface CheckoutSettings {
  shippingOptions: Array<{
    id: string;
    label: LocalizedText;
    price: number;
  }>;
  paymentMethods: Array<{
    id: string;
    label: LocalizedText;
  }>;
}

export interface UiTheme {
  primary: string;
  secondary: string;
  dark: string;
  light: string;
}

export interface Settings {
  company: CompanySettings;
  languages: LanguageSettings[];
  ui: {
    theme: UiTheme;
  };
  checkout: CheckoutSettings;
  analytics: {
    gtmId: string | null;
    facebookPixel: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SessionToken {
  id: string;
  adminId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  lastSeenAt: string;
  userAgent?: string;
  ip?: string;
}
