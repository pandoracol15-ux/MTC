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
  Calendar,
  Share2,
  Phone,
  RefreshCw,
  MoreVertical,
  Edit2,
  Trash2,
  ShieldCheck,
  CreditCard,
  User,
} from 'lucide-react';

interface AccountCardProps {
  account: StreamingAccount;
  onEdit: (account: StreamingAccount) => void;
  onDelete: (accountId: string) => void;
  onRenewQuick: (account: StreamingAccount) => void;
  onViewDetails: (account: StreamingAccount) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onEdit,
  onDelete,
  onRenewQuick,
  onViewDetails,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const serviceCfg = SERVICES_CONFIG[account.service] || SERVICES_CONFIG['Otro'];
  const effectiveStatus = getEffectiveStatus(account);
  const statusInfo = getStatusLabel(effectiveStatus);
  const daysRemaining = getDaysRemaining(account.expirationDate);

  const occupiedProfiles = (account.profiles || []).filter((p) => p.status === 'ocupado').length;
  const totalProfiles = account.profilesCount || account.profiles?.length || 1;

  const copyToClipboard = (text: string, fieldName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const copyClientMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = generateClientDeliveryMessage(account);
    navigator.clipboard.writeText(msg);
    setCopiedField('client_msg');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all hover:shadow-sm overflow-hidden flex flex-col justify-between group">
      {/* Top Banner with Service and Status */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${serviceCfg.accentBg} ${serviceCfg.accentText} border ${serviceCfg.badgeBorder}`}
            >
              {account.service.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {account.customServiceName || account.service}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                <span>{account.supplierName}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-slate-400" />
                  {account.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Status pill & options dropdown */}
          <div className="flex items-center gap-1.5 relative">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${statusInfo.bg} ${statusInfo.textClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
              {statusInfo.text}
            </span>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Más opciones"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 text-xs">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onViewDetails(account);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Ver Perfiles y Detalles
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onRenewQuick(account);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                      Renovar +30 Días
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(account);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      Editar Cuenta
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        if (confirm(`¿Deseas eliminar la cuenta de ${account.email}?`)) {
                          onDelete(account.id);
                        }
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar Cuenta
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Credentials Box */}
        <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/60 space-y-2 mb-3">
          {/* Email Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Correo:</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-800 text-[11.5px] truncate max-w-[210px]">
              <span className="truncate select-all" title={account.email}>
                {account.email}
              </span>
              <button
                onClick={(e) => copyToClipboard(account.email, 'email', e)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors shrink-0"
                title="Copiar correo"
              >
                {copiedField === 'email' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Contraseña:</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-800 text-[11.5px]">
              <span className="tracking-wide">
                {showPassword ? account.password : '••••••••••••'}
              </span>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={(e) => copyToClipboard(account.password, 'password', e)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                title="Copiar contraseña"
              >
                {copiedField === 'password' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expiration and Dates row */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Alta: {formatDateDisplay(account.purchaseDate)}</span>
            </div>
            <div className="font-mono tabular-nums text-[11px] font-semibold">
              Vence: {formatDateDisplay(account.expirationDate)}
            </div>
          </div>

          {/* Countdown badge / reminder */}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-slate-500">Días restantes:</span>
            <span
              className={`font-mono tabular-nums font-bold ${
                daysRemaining < 0
                  ? 'text-rose-600'
                  : daysRemaining <= 5
                  ? 'text-amber-600'
                  : 'text-emerald-700'
              }`}
            >
              {daysRemaining < 0
                ? `Venció hace ${Math.abs(daysRemaining)} días`
                : daysRemaining === 0
                ? '¡Vence Hoy!'
                : `${daysRemaining} días`}
            </span>
          </div>
        </div>

        {/* Profiles Allocation & Pricing */}
        <div className="bg-slate-50/50 rounded-lg p-2 border border-slate-100 text-[11px] flex items-center justify-between">
          <div>
            <div className="text-slate-400">Pantallas / Perfiles</div>
            <div className="font-semibold text-slate-800">
              {occupiedProfiles} / {totalProfiles} ocupados
            </div>
          </div>
          <div className="text-right">
            <div className="text-slate-400">Costo Proveedor</div>
            <div className="font-mono tabular-nums font-bold text-slate-900">
              {formatCurrency(account.purchasePrice, account.currency)}
            </div>
          </div>
        </div>

        {/* Supplier Phone / WhatsApp indicator */}
        {account.supplierPhone && (
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="truncate">Tel: {account.supplierPhone}</span>
            <a
              href={`https://wa.me/${account.supplierPhone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-3.5 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
        <button
          onClick={() => onViewDetails(account)}
          className="text-blue-600 hover:text-blue-700 font-semibold px-2 py-1 rounded hover:bg-blue-50/60 transition-colors"
        >
          Gestionar Perfiles
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={copyClientMessage}
            className="p-1.5 rounded-md text-slate-600 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
            title="Copiar plantilla para enviar a cliente por WhatsApp"
          >
            {copiedField === 'client_msg' ? (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <Check className="w-3 h-3" /> Copiado!
              </span>
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => onRenewQuick(account)}
            className="p-1.5 rounded-md text-slate-600 hover:text-emerald-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
            title="Renovación Rápida (+30 días)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onEdit(account)}
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
            title="Editar datos de cuenta"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
