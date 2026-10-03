import React, { useState } from 'react';
import { StreamingAccount } from '../types';
import {
  formatCurrency,
  formatDateDisplay,
  getDaysRemaining,
  getEffectiveStatus,
  getStatusLabel,
  generateClientDeliveryMessage,
} from '../utils/formatters';
import { SERVICES_CONFIG } from '../utils/constants';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Edit2,
  Trash2,
  Share2,
  ExternalLink,
} from 'lucide-react';

interface AccountTableProps {
  accounts: StreamingAccount[];
  onEdit: (account: StreamingAccount) => void;
  onDelete: (accountId: string) => void;
  onRenewQuick: (account: StreamingAccount) => void;
  onViewDetails: (account: StreamingAccount) => void;
}

export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  onEdit,
  onDelete,
  onRenewQuick,
  onViewDetails,
}) => {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const copyClientMessage = (account: StreamingAccount) => {
    const msg = generateClientDeliveryMessage(account);
    navigator.clipboard.writeText(msg);
    setCopiedKey(`msg_${account.id}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center text-slate-500">
        No se encontraron cuentas con los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold select-none">
              <th className="py-3 px-4">Servicio</th>
              <th className="py-3 px-4">Credenciales (Correo / Clave)</th>
              <th className="py-3 px-4">Proveedor & Pago</th>
              <th className="py-3 px-4">Fechas (Alta / Vence)</th>
              <th className="py-3 px-4 text-right">Costo Proveedor</th>
              <th className="py-3 px-4 text-center">Perfiles</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accounts.map((account) => {
              const serviceCfg = SERVICES_CONFIG[account.service] || SERVICES_CONFIG['Otro'];
              const effectiveStatus = getEffectiveStatus(account);
              const statusInfo = getStatusLabel(effectiveStatus);
              const daysRemaining = getDaysRemaining(account.expirationDate);
              const isPasswordVisible = !!visiblePasswords[account.id];

              const totalProfiles = account.profilesCount || account.profiles?.length || 1;
              const occupiedProfiles = (account.profiles || []).filter(
                (p) => p.status === 'ocupado'
              ).length;

              return (
                <tr
                  key={account.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => onViewDetails(account)}
                >
                  {/* Service */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${serviceCfg.accentBg} ${serviceCfg.accentText} border ${serviceCfg.badgeBorder}`}
                      >
                        {account.service.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900">
                        {account.customServiceName || account.service}
                      </span>
                    </div>
                  </td>

                  {/* Credentials */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-1">
                      {/* Email */}
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-800">
                        <span className="select-all truncate max-w-[200px]" title={account.email}>
                          {account.email}
                        </span>
                        <button
                          onClick={() => copyToClipboard(account.email, `email_${account.id}`)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title="Copiar correo"
                        >
                          {copiedKey === `email_${account.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {/* Password */}
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
                        <span className="tracking-wide">
                          {isPasswordVisible ? account.password : '••••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(account.id)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title={isPasswordVisible ? 'Ocultar' : 'Mostrar'}
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(account.password, `pass_${account.id}`)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title="Copiar contraseña"
                        >
                          {copiedKey === `pass_${account.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Supplier & Payment */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{account.supplierName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>{account.paymentMethod}</span>
                      {account.supplierPhone && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-600">{account.supplierPhone}</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Dates & Countdown */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono tabular-nums text-slate-800 font-medium">
                      {formatDateDisplay(account.expirationDate)}
                    </div>
                    <div className="text-[11px]">
                      <span
                        className={`font-mono tabular-nums font-semibold ${
                          daysRemaining < 0
                            ? 'text-rose-600'
                            : daysRemaining <= 5
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {daysRemaining < 0
                          ? `Venció hace ${Math.abs(daysRemaining)}d`
                          : daysRemaining === 0
                          ? 'Vence hoy'
                          : `${daysRemaining} días restantes`}
                      </span>
                    </div>
                  </td>

                  {/* Cost */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      {formatCurrency(account.purchasePrice, account.currency)}
                    </span>
                    {account.salePrice ? (
                      <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                        Venta: {formatCurrency(account.salePrice, account.currency)}
                      </div>
                    ) : null}
                  </td>

                  {/* Profiles */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[11px] font-mono tabular-nums font-medium text-slate-700">
                      {occupiedProfiles} / {totalProfiles}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${statusInfo.bg} ${statusInfo.textClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                      {statusInfo.text}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => copyClientMessage(account)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                        title="Copiar plantilla para cliente (WhatsApp)"
                      >
                        {copiedKey === `msg_${account.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => onRenewQuick(account)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors"
                        title="Renovación rápida (+30 días)"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEdit(account)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                        title="Editar cuenta"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar la cuenta de ${account.email}?`)) {
                            onDelete(account.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onViewDetails(account)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors ml-1"
                        title="Ver detalles completos"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
