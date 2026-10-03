import React from 'react';
import { StreamingAccount } from '../types';
import { getEffectiveStatus, formatCurrency } from '../utils/formatters';
import { ShieldAlert, AlertTriangle, CheckCircle2, TrendingUp, Users } from 'lucide-react';

interface MetricsCardsProps {
  accounts: StreamingAccount[];
  onFilterStatus?: (status: string) => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ accounts, onFilterStatus }) => {
  let activeCount = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;
  let warrantyCount = 0;
  let totalCost = 0;
  let totalProjectedSales = 0;
  let totalProfiles = 0;
  let occupiedProfiles = 0;

  accounts.forEach((acc) => {
    const effStatus = getEffectiveStatus(acc);
    if (effStatus === 'active') activeCount++;
    if (effStatus === 'expiring_soon') expiringSoonCount++;
    if (effStatus === 'expired') expiredCount++;
    if (effStatus === 'warranty_claim') warrantyCount++;

    totalCost += Number(acc.purchasePrice) || 0;
    totalProjectedSales += Number(acc.salePrice) || 0;

    const profiles = acc.profiles || [];
    totalProfiles += profiles.length;
    occupiedProfiles += profiles.filter((p) => p.status === 'ocupado').length;
  });

  const estimatedProfit = Math.max(0, totalProjectedSales - totalCost);
  const profilesOccupancyRate = totalProfiles > 0 ? Math.round((occupiedProfiles / totalProfiles) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* 1. Total Cuentas */}
      <button
        type="button"
        onClick={() => onFilterStatus?.('all')}
        className="text-left bg-white p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors shadow-xs"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500">Total Cuentas</span>
          <span className="w-2 h-2 rounded-full bg-blue-500" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
          {accounts.length}
        </div>
        <div className="text-[11px] text-slate-400 mt-1 truncate">
          {accounts.length === 1 ? '1 cuenta registrada' : `${accounts.length} en inventario`}
        </div>
      </button>

      {/* 2. Activas */}
      <button
        type="button"
        onClick={() => onFilterStatus?.('active')}
        className="text-left bg-white p-4 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-colors shadow-xs group"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500 group-hover:text-emerald-700">Activas</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-emerald-600 font-mono tabular-nums">
          {activeCount}
        </div>
        <div className="text-[11px] text-slate-400 mt-1 truncate">
          Vigentes sin alerta
        </div>
      </button>

      {/* 3. Por Vencer (< 5 días) */}
      <button
        type="button"
        onClick={() => onFilterStatus?.('expiring_soon')}
        className={`text-left bg-white p-4 rounded-xl border transition-colors shadow-xs group ${
          expiringSoonCount > 0 ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200/80 hover:border-amber-300'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500 group-hover:text-amber-700">Por Vencer</span>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-amber-600 font-mono tabular-nums">
          {expiringSoonCount}
        </div>
        <div className="text-[11px] text-amber-700/80 font-medium mt-1 truncate">
          {expiringSoonCount > 0 ? 'Próximos 5 días' : 'Sin pendientes'}
        </div>
      </button>

      {/* 4. Vencidas */}
      <button
        type="button"
        onClick={() => onFilterStatus?.('expired')}
        className={`text-left bg-white p-4 rounded-xl border transition-colors shadow-xs group ${
          expiredCount > 0 ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/80 hover:border-rose-300'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500 group-hover:text-rose-700">Vencidas</span>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-rose-600 font-mono tabular-nums">
          {expiredCount}
        </div>
        <div className="text-[11px] text-rose-700/80 font-medium mt-1 truncate">
          {expiredCount > 0 ? 'Requiere renovación' : '0 vencidas'}
        </div>
      </button>

      {/* 5. Inversión en Proveedores */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500">Costo Proveedores</span>
          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <div className="text-lg font-bold tracking-tight text-slate-900 font-mono tabular-nums truncate">
          {formatCurrency(totalCost, 'COP')}
        </div>
        <div className="text-[11px] text-slate-400 mt-1 truncate">
          Margen est: {formatCurrency(estimatedProfit, 'COP')}
        </div>
      </div>

      {/* 6. Perfiles Ocupados */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500">Perfiles / Pantallas</span>
          <Users className="w-3.5 h-3.5 text-indigo-600" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
          {occupiedProfiles} <span className="text-xs font-normal text-slate-400 font-sans">/ {totalProfiles}</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
          <span>{totalProfiles - occupiedProfiles} disponibles</span>
          <span className="font-mono tabular-nums font-medium text-indigo-600">{profilesOccupancyRate}%</span>
        </div>
      </div>
    </div>
  );
};
