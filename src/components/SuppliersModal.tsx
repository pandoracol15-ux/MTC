import React from 'react';
import { StreamingAccount, SupplierSummary } from '../types';
import { formatCurrency, getEffectiveStatus } from '../utils/formatters';
import { X, Users, Phone, ShieldAlert, CreditCard, CheckCircle2, ChevronRight } from 'lucide-react';

interface SuppliersModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: StreamingAccount[];
  onSelectSupplierFilter: (supplierName: string) => void;
}

export const SuppliersModal: React.FC<SuppliersModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onSelectSupplierFilter,
}) => {
  if (!isOpen) return null;

  // Aggregate supplier data
  const suppliersMap = new Map<string, SupplierSummary & { accountsList: StreamingAccount[] }>();

  accounts.forEach((acc) => {
    const name = acc.supplierName || 'Sin Proveedor';
    const effStatus = getEffectiveStatus(acc);

    if (!suppliersMap.has(name)) {
      suppliersMap.set(name, {
        name,
        phone: acc.supplierPhone,
        accountsCount: 0,
        activeAccounts: 0,
        expiredAccounts: 0,
        warrantyClaims: 0,
        totalSpent: 0,
        preferredPaymentMethod: acc.paymentMethod,
        accountsList: [],
      });
    }

    const data = suppliersMap.get(name)!;
    data.accountsCount += 1;
    if (effStatus === 'active' || effStatus === 'expiring_soon') {
      data.activeAccounts += 1;
    }
    if (effStatus === 'expired') {
      data.expiredAccounts += 1;
    }
    if (effStatus === 'warranty_claim') {
      data.warrantyClaims += 1;
    }
    data.totalSpent += Number(acc.purchasePrice) || 0;
    if (acc.supplierPhone && !data.phone) {
      data.phone = acc.supplierPhone;
    }
    data.accountsList.push(acc);
  });

  const suppliers = Array.from(suppliersMap.values()).sort(
    (a, b) => b.accountsCount - a.accountsCount
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-semibold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Directorio de Proveedores</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Historial de compras, fiabilidad y canales de contacto directo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {suppliers.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              No hay proveedores registrados aún.
            </div>
          ) : (
            suppliers.map((supp) => (
              <div
                key={supp.name}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{supp.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        {supp.preferredPaymentMethod || 'Nequi'}
                      </span>
                      {supp.phone && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{supp.phone}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {supp.phone && (
                      <a
                        href={`https://wa.me/${supp.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <button
                      onClick={() => {
                        onSelectSupplierFilter(supp.name);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <span>Ver Cuentas ({supp.accountsCount})</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Metrics for supplier */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div className="bg-slate-50/70 p-2 rounded-lg">
                    <span className="text-slate-400 block">Total Compradas</span>
                    <span className="font-mono tabular-nums font-bold text-slate-800 text-sm">
                      {supp.accountsCount}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 p-2 rounded-lg">
                    <span className="text-slate-400 block">Activas / Vigentes</span>
                    <span className="font-mono tabular-nums font-bold text-emerald-600 text-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {supp.activeAccounts}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 p-2 rounded-lg">
                    <span className="text-slate-400 block">En Reclamo</span>
                    <span className="font-mono tabular-nums font-bold text-purple-600 text-sm flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> {supp.warrantyClaims}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 p-2 rounded-lg">
                    <span className="text-slate-400 block">Total Invertido</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                      {formatCurrency(supp.totalSpent, 'COP')}
                    </span>
                  </div>
                </div>

                {/* Account Pills List */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {supp.accountsList.map((acc) => (
                    <span
                      key={acc.id}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10.5px] font-mono"
                    >
                      {acc.customServiceName || acc.service} ({acc.email.split('@')[0]})
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
