import { StreamingServiceType, PaymentMethod } from '../types';

export interface ServiceConfig {
  name: StreamingServiceType;
  displayName: string;
  themeColor: string;
  accentBg: string;
  accentText: string;
  badgeBorder: string;
  defaultProfiles: number;
}

export const SERVICES_CONFIG: Record<StreamingServiceType, ServiceConfig> = {
  'Disney+': {
    name: 'Disney+',
    displayName: 'Disney+',
    themeColor: '#113CCF',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    defaultProfiles: 4,
  },
  'YouTube Premium': {
    name: 'YouTube Premium',
    displayName: 'YouTube Premium',
    themeColor: '#FF0000',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    defaultProfiles: 5,
  },
  Netflix: {
    name: 'Netflix',
    displayName: 'Netflix',
    themeColor: '#E50914',
    accentBg: 'bg-red-50',
    accentText: 'text-red-700',
    badgeBorder: 'border-red-200',
    defaultProfiles: 5,
  },
  Max: {
    name: 'Max',
    displayName: 'Max (HBO)',
    themeColor: '#002BE7',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    defaultProfiles: 3,
  },
  'Amazon Prime': {
    name: 'Amazon Prime',
    displayName: 'Prime Video',
    themeColor: '#00A8E1',
    accentBg: 'bg-cyan-50',
    accentText: 'text-cyan-700',
    badgeBorder: 'border-cyan-200',
    defaultProfiles: 3,
  },
  Spotify: {
    name: 'Spotify',
    displayName: 'Spotify',
    themeColor: '#1DB954',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    defaultProfiles: 6,
  },
  'Paramount+': {
    name: 'Paramount+',
    displayName: 'Paramount+',
    themeColor: '#0064FF',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    defaultProfiles: 3,
  },
  Crunchyroll: {
    name: 'Crunchyroll',
    displayName: 'Crunchyroll',
    themeColor: '#F47521',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-700',
    badgeBorder: 'border-orange-200',
    defaultProfiles: 4,
  },
  'Apple TV+': {
    name: 'Apple TV+',
    displayName: 'Apple TV+',
    themeColor: '#1E293B',
    accentBg: 'bg-slate-100',
    accentText: 'text-slate-800',
    badgeBorder: 'border-slate-300',
    defaultProfiles: 5,
  },
  IPTV: {
    name: 'IPTV',
    displayName: 'IPTV Pro',
    themeColor: '#7C3AED',
    accentBg: 'bg-purple-50',
    accentText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    defaultProfiles: 3,
  },
  'Magis TV': {
    name: 'Magis TV',
    displayName: 'Magis TV',
    themeColor: '#0284C7',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    defaultProfiles: 3,
  },
  Tidal: {
    name: 'Tidal',
    displayName: 'Tidal HiFi',
    themeColor: '#000000',
    accentBg: 'bg-zinc-100',
    accentText: 'text-zinc-800',
    badgeBorder: 'border-zinc-300',
    defaultProfiles: 5,
  },
  Otro: {
    name: 'Otro',
    displayName: 'Otro Servicio',
    themeColor: '#475569',
    accentBg: 'bg-slate-100',
    accentText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    defaultProfiles: 1,
  },
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Nequi',
  'Daviplata',
  'Bancolombia',
  'Binance USDT',
  'PayPal',
  'Zelle',
  'Transferencia Bancaria',
  'Tarjeta de Crédito/Débito',
  'Efectivo',
  'Otro',
];

export const SERVICE_LIST: StreamingServiceType[] = [
  'Disney+',
  'YouTube Premium',
  'Netflix',
  'Max',
  'Amazon Prime',
  'Spotify',
  'Paramount+',
  'Crunchyroll',
  'Apple TV+',
  'IPTV',
  'Magis TV',
  'Tidal',
  'Otro',
];
