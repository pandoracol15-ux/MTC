import React from 'react';
import { StreamingAccount } from '../types';
import { formatCurrency, getDaysRemaining, getEffectiveStatus } from '../utils/formatters';
import { SERVICES_CONFIG } from '../utils/constants';
import { TrendingUp, DollarSign, Wallet, CalendarClock, PieChart, ShieldAlert } from 'lucide-react';

interface FinanceViewProps {
  accounts: StreamingAccount[];
}

export const FinanceView: React.FC<FinanceViewProps> = ({ accounts }) => {
  let totalCost = 0;
  let totalProjectedRevenue = 0;
  const costByService: Record<string, { count: number; totalCost: number }> = {};
  const costBySupplier: Record<string, { count: number; totalCost: number }> = {};
  const costByPayment: Record<string, { count: number; totalCost: number }> = {};

  let expiringThisWeek = 0;
  let expiringThisMonth = 0;
  let alreadyExpired = 0;

  accounts.forEach((acc) => {
    const cost = Number(acc.purchasePrice) || 0;
    const sale = Number(acc.salePrice) || 0;
    totalCost += cost;
    totalProjectedRevenue += sale;

    // By service
    const srv = acc.customServiceName || acc.service;
    if (!costByService[srv]) costByService[srv] = { count: 0, totalCost: 0 };
    costByService[srv].count += 1;
    costByService[srv].totalCost += cost;

    // By supplier
    const supp = acc.supplierName || 'Sin Proveedor';
    if (!costBySupplier[supp]) costBySupplier[supp] = { count: 0, totalCost: 0 };
    costBySupplier[supp].count += 1;
    costBySupplier[supp].totalCost += cost;

    // By payment method
    const pm = acc.paymentMethod || 'Otro';
    if (!costByPayment[pm]) costByPayment[pm] = { count: 0, totalCost: 0 };
    costByPayment[pm].count += 1;
    costByPayment[pm].totalCost += cost;

    // Expiration analysis
    const days = getDaysRemaining(acc.expirationDate);
    if (days < 0) alreadyExpired++;
    else if (days <= 7) expiringThisWeek++;
    else if (days <= 30) expiringThisMonth++;
  });

  const estimatedProfit = Math.max(0, totalProjectedRevenue - totalCost);
  const profitMarginPercent =
    totalProjectedRevenue > 0
      ? Math.round((estimatedProfit / totalProjectedRevenue) * 100)
      : 0;

  // Sorted lists
  const sortedServices = Object.entries(costByService).sort((a, b) => b[1].totalCost - a[1].totalCost);
  const sortedSuppliers = Object.entries(costBySupplier).sort((a, b) => b[1].totalCost - a[1].totalCost);
  const sortedPayments = Object.entries(costByPayment).sort((a, b) => b[1].totalCost - a[1].totalCost);

  return (
    <div className="space-y-6">
      {/* 3 Top Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Invertido */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Inversión Total en Proveedores</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {formatCurrency(totalCost, 'COP')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Gasto acumulado en inventario activo y reciente
          </p>
        </div>

        {/* Ingresos Proyectados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Ventas Proyectadas / Estimadas</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {formatCurrency(totalProjectedRevenue, 'COP')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Valor de reventa si todas las cuentas y pantallas se colocan
          </p>
        </div>

        {/* Ganancia Estimada */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Ganancia Neta Estimada</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-600 font-mono tabular-nums">
            {formatCurrency(estimatedProfit, 'COP')}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            Margen de rentabilidad: {profitMarginPercent}%
          </p>
        </div>
      </div>

      {/* Expirations alert grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <CalendarClock className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Calendario y Próximos Vencimientos a Proveedores
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl">
            <span className="text-amber-800 font-semibold block">Vencen en los próximos 7 días</span>
            <div className="text-2xl font-bold text-amber-900 font-mono tabular-nums mt-1">
              {expiringThisWeek} cuentas
            </div>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Contactar proveedores para pago de renovación
            </p>
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-xl">
            <span className="text-blue-800 font-semibold block">Vencen entre 8 y 30 días</span>
            <div className="text-2xl font-bold text-blue-900 font-mono tabular-nums mt-1">
              {expiringThisMonth} cuentas
            </div>
            <p className="text-[11px] text-blue-700 mt-0.5">
              Tiempo suficiente para cobro a clientes
            </p>
          </div>

          <div className="p-3 bg-rose-50/60 border border-rose-200/70 rounded-xl">
            <span className="text-rose-800 font-semibold block">Cuentas Vencidas</span>
            <div className="text-2xl font-bold text-rose-900 font-mono tabular-nums mt-1">
              {alreadyExpired} cuentas
            </div>
            <p className="text-[11px] text-rose-700 mt-0.5">
              Revisar si se renuevan o se descartan
            </p>
          </div>
        </div>
      </div>

      {/* Breakdowns 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Cost by Platform */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-blue-600" />
            Inversión por Plataforma Streaming
          </h3>
          <div className="divide-y divide-slate-100">
            {sortedServices.map(([srv, data]) => {
              const percent = totalCost > 0 ? Math.round((data.totalCost / totalCost) * 100) : 0;
              return (
                <div key={srv} className="py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800">{srv}</span>
                    <div className="text-[11px] text-slate-400">
                      {data.count} {data.count === 1 ? 'cuenta' : 'cuentas'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono tabular-nums font-bold text-slate-900">
                      {formatCurrency(data.totalCost, 'COP')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono tabular-nums">{percent}% del total</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cost by Supplier */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-indigo-600" />
            Inversión por Proveedor
          </h3>
          <div className="divide-y divide-slate-100">
            {sortedSuppliers.map(([supp, data]) => {
              const percent = totalCost > 0 ? Math.round((data.totalCost / totalCost) * 100) : 0;
              return (
                <div key={supp} className="py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800">{supp}</span>
                    <div className="text-[11px] text-slate-400">
                      {data.count} {data.count === 1 ? 'cuenta' : 'cuentas'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono tabular-nums font-bold text-slate-900">
                      {formatCurrency(data.totalCost, 'COP')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono tabular-nums">{percent}% del total</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
