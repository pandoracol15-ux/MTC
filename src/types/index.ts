export type StreamingServiceType =
  | 'Disney+'
  | 'YouTube Premium'
  | 'Netflix'
  | 'Max'
  | 'Amazon Prime'
  | 'Spotify'
  | 'Paramount+'
  | 'Crunchyroll'
  | 'Apple TV+'
  | 'IPTV'
  | 'Magis TV'
  | 'Tidal'
  | 'Otro';

export type AccountStatus =
  | 'active'          // Más de 5 días
  | 'expiring_soon'   // 0 a 5 días
  | 'expired'         // Menos de 0 días
  | 'warranty_claim'  // En reclamo / garantía
  | 'cancelled';      // Cancelada o inactiva

export type PaymentMethod =
  | 'Nequi'
  | 'Daviplata'
  | 'Bancolombia'
  | 'Binance USDT'
  | 'PayPal'
  | 'Zelle'
  | 'Transferencia Bancaria'
  | 'Tarjeta de Crédito/Débito'
  | 'Efectivo'
  | 'Otro';

export interface AccountProfile {
  id: string;
  profileNumber: number;
  name: string;
  pin?: string;
  assignedToClient?: string;
  clientPhone?: string;
  status: 'disponible' | 'ocupado';
  salePrice?: number;
  deliveryDate?: string;
  notes?: string;
}

export interface RenewalRecord {
  id: string;
  date: string;
  cost: number;
  durationDays: number;
  extendedUntil: string;
  paymentMethod?: string;
  note?: string;
}

export interface StreamingAccount {
  id: string;
  service: StreamingServiceType;
  customServiceName?: string;
  email: string;
  password: string;
  purchasePrice: number;
  salePrice?: number;
  currency: 'COP' | 'USD' | 'EUR' | 'MXN';
  purchaseDate: string;   // YYYY-MM-DD
  expirationDate: string; // YYYY-MM-DD
  supplierName: string;
  supplierPhone?: string;
  supplierContactType?: 'WhatsApp' | 'Telegram' | 'Instagram' | 'Otro';
  paymentMethod: PaymentMethod;
  status: AccountStatus;
  profilesCount: number;
  profiles: AccountProfile[];
  warrantyDays: number;
  warrantyNotes?: string;
  notes?: string;
  renewalHistory?: RenewalRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface SupplierSummary {
  name: string;
  phone?: string;
  accountsCount: number;
  activeAccounts: number;
  expiredAccounts: number;
  warrantyClaims: number;
  totalSpent: number;
  preferredPaymentMethod?: string;
  rating?: number;
}

export interface ServiceMeta {
  name: StreamingServiceType;
  colorBg: string;
  colorText: string;
  borderColor: string;
  accentColor: string;
  defaultProfiles: number;
  iconName: string;
}
