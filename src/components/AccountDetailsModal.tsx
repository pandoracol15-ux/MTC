import React, { useState } from 'react';
import { StreamingAccount, AccountProfile } from '../types';
import {
  formatCurrency,
  formatDateDisplay,
  getDaysRemaining,
  getEffectiveStatus,
  getStatusLabel,
  generateClientDeliveryMessage,
  generateSupplierClaimMessage,
  addDaysToDate,
  getTodayDateString,
} from '../utils/formatters';
import { SERVICES_CONFIG } from '../utils/constants';
import {
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Phone,
  ShieldCheck,
  Send,
  Calendar,
  Lock,
  UserCheck,
  History,
} from 'lucide-react';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: StreamingAccount | null;
  onUpdateAccount: (updated: StreamingAccount) => void;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  isOpen,
  onClose,
  account,
  onUpdateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'perfiles' | 'mensajes' | 'historial'>('perfiles');
  const [renewDays, setRenewDays] = useState<number>(30);
  const [renewCost, setRenewCost] = useState<number>(account?.purchasePrice || 0);
  const [showRenewPanel, setShowRenewPanel] = useState<boolean>(false);

  if (!isOpen || !account) return null;

  const serviceCfg = SERVICES_CONFIG[account.service] || SERVICES_CONFIG['Otro'];
  const effectiveStatus = getEffectiveStatus(account);
  const statusInfo = getStatusLabel(effectiveStatus);
  const daysRemaining = getDaysRemaining(account.expirationDate);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleProfileStatusToggle = (profileId: string) => {
    const updatedProfiles: AccountProfile[] = (account.profiles || []).map((prof) => {
      if (prof.id === profileId) {
        const nextStatus: 'disponible' | 'ocupado' =
          prof.status === 'ocupado' ? 'disponible' : 'ocupado';
        return {
          ...prof,
          status: nextStatus,
          assignedToClient: nextStatus === 'disponible' ? '' : prof.assignedToClient,
        };
      }
      return prof;
    });

    onUpdateAccount({
      ...account,
      profiles: updatedProfiles,
      updatedAt: getTodayDateString(),
    });
  };

  const handleExecuteRenewal = () => {
    const newExpDate = addDaysToDate(account.expirationDate, renewDays);
    const newHistory = [
      ...(account.renewalHistory || []),
      {
        id: `ren_${Date.now()}`,
        date: getTodayDateString(),
        cost: Number(renewCost) || 0,
        durationDays: renewDays,
        extendedUntil: newExpDate,
        paymentMethod: account.paymentMethod,
        note: `Renovación de ${renewDays} días agregada`,
      },
    ];

    onUpdateAccount({
      ...account,
      expirationDate: newExpDate,
      status: 'active',
      renewalHistory: newHistory,
      updatedAt: getTodayDateString(),
    });

    setShowRenewPanel(false);
    alert(`¡Cuenta renovada con éxito por ${renewDays} días más! Nueva fecha de vencimiento: ${newExpDate}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${serviceCfg.accentBg} ${serviceCfg.accentText} border ${serviceCfg.badgeBorder}`}
            >
              {account.service.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  {account.customServiceName || account.service}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-medium ${statusInfo.bg} ${statusInfo.textClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                  {statusInfo.text}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Proveedor: <strong className="text-slate-700">{account.supplierName}</strong> ({account.paymentMethod})
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

        {/* Credentials & Expiration Quick Bar */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Credentials */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400">CREDENCIALES DE ACCESO</div>
            {/* Email */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Correo:</span>
              <div className="flex items-center gap-1.5 font-mono text-slate-900">
                <span className="select-all font-semibold">{account.email}</span>
                <button
                  onClick={() => copyText(account.email, 'email')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded"
                  title="Copiar correo"
                >
                  {copiedKey === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Clave:</span>
              <div className="flex items-center gap-1.5 font-mono text-slate-900">
                <span className="select-all font-semibold">
                  {showPassword ? account.password : '••••••••••••'}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => copyText(account.password, 'password')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded"
                  title="Copiar contraseña"
                >
                  {copiedKey === 'password' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Dates & Cost */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Fecha Alta:</span>
              <span className="font-mono text-slate-800">{formatDateDisplay(account.purchaseDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Vence:</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatDateDisplay(account.expirationDate)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
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
                  : `${daysRemaining} días`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Costo compra:</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">
                {formatCurrency(account.purchasePrice, account.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action: Renew Bar */}
        <div className="px-6 py-2.5 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900 font-medium">
              {showRenewPanel ? 'Configurar Renovación:' : '¿Deseas extender la cuenta con el proveedor?'}
            </span>
          </div>

          {!showRenewPanel ? (
            <button
              onClick={() => {
                setShowRenewPanel(true);
                setRenewCost(account.purchasePrice);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Renovar Cuenta</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <select
                value={renewDays}
                onChange={(e) => setRenewDays(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
              >
                <option value={30}>+30 Días (1 mes)</option>
                <option value={60}>+60 Días (2 meses)</option>
                <option value={90}>+90 Días (3 meses)</option>
                <option value={180}>+180 Días (6 meses)</option>
                <option value={365}>+365 Días (1 año)</option>
              </select>
              <input
                type="number"
                value={renewCost}
                onChange={(e) => setRenewCost(Number(e.target.value))}
                placeholder="Costo"
                title="Costo de la renovación"
                className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-mono text-xs"
              />
              <button
                onClick={handleExecuteRenewal}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowRenewPanel(false)}
                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-slate-200 px-6 bg-white text-xs">
          <button
            onClick={() => setActiveTab('perfiles')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'perfiles'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Perfiles / Pantallas ({(account.profiles || []).length})
          </button>
          <button
            onClick={() => setActiveTab('mensajes')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'mensajes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Plantillas WhatsApp (Cliente / Proveedor)
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'historial'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Historial de Renovaciones ({account.renewalHistory?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: PERFILES */}
          {activeTab === 'perfiles' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span>Asignación y estado individual de cada pantalla/perfil:</span>
                <span className="font-medium text-slate-700">
                  {(account.profiles || []).filter((p) => p.status === 'ocupado').length} de{' '}
                  {(account.profiles || []).length} ocupados
                </span>
              </div>

              {(account.profiles || []).map((prof) => (
                <div
                  key={prof.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{prof.name}</span>
                      {prof.pin && (
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px] font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-400" /> PIN: {prof.pin}
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11.5px]">
                      {prof.assignedToClient ? (
                        <span>
                          Cliente: <strong className="text-slate-800">{prof.assignedToClient}</strong>
                          {prof.clientPhone && ` (${prof.clientPhone})`}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Disponible para venta o asignación</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleProfileStatusToggle(prof.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        prof.status === 'ocupado'
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{prof.status === 'ocupado' ? 'Ocupado' : 'Disponible'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const msg = generateClientDeliveryMessage(account, prof);
                        copyText(msg, `prof_msg_${prof.id}`);
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                      title="Copiar credenciales listas para enviar a este cliente"
                    >
                      {copiedKey === `prof_msg_${prof.id}` ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Copiado
                        </span>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar Datos</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: MENSAJES WHATSAPP */}
          {activeTab === 'mensajes' && (
            <div className="space-y-4">
              {/* Client Message */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    Plantilla de Entrega para Cliente
                  </span>
                  <button
                    onClick={() => {
                      const msg = generateClientDeliveryMessage(account);
                      copyText(msg, 'client_tmpl');
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    {copiedKey === 'client_tmpl' ? (
                      <>
                        <Check className="w-3 h-3" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copiar Mensaje
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-wrap select-all">
                  {generateClientDeliveryMessage(account)}
                </pre>
              </div>

              {/* Supplier Claim Message */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                    Plantilla de Reclamo / Soporte a Proveedor
                  </span>
                  <div className="flex items-center gap-2">
                    {account.supplierPhone && (
                      <a
                        href={`https://wa.me/${account.supplierPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          generateSupplierClaimMessage(account)
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> Abrir WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => {
                        const msg = generateSupplierClaimMessage(account);
                        copyText(msg, 'supp_tmpl');
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      {copiedKey === 'supp_tmpl' ? (
                        <>
                          <Check className="w-3 h-3" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copiar Reclamo
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <pre className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-wrap select-all">
                  {generateSupplierClaimMessage(account)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: HISTORIAL DE RENOVACIONES */}
          {activeTab === 'historial' && (
            <div className="space-y-3">
              {(!account.renewalHistory || account.renewalHistory.length === 0) ? (
                <div className="text-center py-8 text-slate-400">
                  <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>No se han registrado renovaciones previas para esta cuenta.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Puedes renovarla arriba usando el botón "Renovar Cuenta".
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {account.renewalHistory.map((item, idx) => (
                    <div key={item.id || idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">
                          Extensión de {item.durationDays} días
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Fecha: {formatDateDisplay(item.date)} · Vencía hasta: {formatDateDisplay(item.extendedUntil)}
                        </div>
                        {item.note && <div className="text-[11px] text-slate-400 mt-0.5">{item.note}</div>}
                      </div>
                      <div className="font-mono tabular-nums font-bold text-slate-900">
                        {formatCurrency(item.cost, account.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
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
