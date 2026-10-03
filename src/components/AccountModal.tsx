import React, { useState, useEffect } from 'react';
import {
  StreamingAccount,
  StreamingServiceType,
  PaymentMethod,
  AccountProfile,
  AccountStatus,
} from '../types';
import { SERVICE_LIST, PAYMENT_METHODS, SERVICES_CONFIG } from '../utils/constants';
import {
  getTodayDateString,
  addDaysToDate,
  addMonthsToDate,
} from '../utils/formatters';
import {
  X,
  KeyRound,
  Calendar,
  Sparkles,
  Users,
  Shield,
  CreditCard,
  User,
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: StreamingAccount) => void;
  initialAccount?: StreamingAccount | null;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAccount,
}) => {
  const [service, setService] = useState<StreamingServiceType>('Disney+');
  const [customServiceName, setCustomServiceName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(15000);
  const [salePrice, setSalePrice] = useState<number>(30000);
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'EUR' | 'MXN'>('COP');
  const [purchaseDate, setPurchaseDate] = useState<string>(getTodayDateString());
  const [expirationDate, setExpirationDate] = useState<string>(
    addDaysToDate(getTodayDateString(), 30)
  );
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierContactType, setSupplierContactType] = useState<
    'WhatsApp' | 'Telegram' | 'Instagram' | 'Otro'
  >('WhatsApp');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Nequi');
  const [status, setStatus] = useState<AccountStatus>('active');
  const [profilesCount, setProfilesCount] = useState<number>(4);
  const [profiles, setProfiles] = useState<AccountProfile[]>([]);
  const [warrantyDays, setWarrantyDays] = useState<number>(30);
  const [warrantyNotes, setWarrantyNotes] = useState('');
  const [notes, setNotes] = useState('');

  // Sync state when editing or creating
  useEffect(() => {
    if (initialAccount) {
      setService(initialAccount.service);
      setCustomServiceName(initialAccount.customServiceName || '');
      setEmail(initialAccount.email);
      setPassword(initialAccount.password);
      setPurchasePrice(initialAccount.purchasePrice || 0);
      setSalePrice(initialAccount.salePrice || 0);
      setCurrency(initialAccount.currency || 'COP');
      setPurchaseDate(initialAccount.purchaseDate || getTodayDateString());
      setExpirationDate(initialAccount.expirationDate || addDaysToDate(getTodayDateString(), 30));
      setSupplierName(initialAccount.supplierName || '');
      setSupplierPhone(initialAccount.supplierPhone || '');
      setSupplierContactType(initialAccount.supplierContactType || 'WhatsApp');
      setPaymentMethod(initialAccount.paymentMethod || 'Nequi');
      setStatus(initialAccount.status || 'active');
      setProfilesCount(initialAccount.profilesCount || initialAccount.profiles?.length || 4);
      setProfiles(initialAccount.profiles || []);
      setWarrantyDays(initialAccount.warrantyDays || 30);
      setWarrantyNotes(initialAccount.warrantyNotes || '');
      setNotes(initialAccount.notes || '');
    } else {
      // Default new account
      const today = getTodayDateString();
      setService('Disney+');
      setCustomServiceName('');
      setEmail('');
      setPassword('');
      setPurchasePrice(14000);
      setSalePrice(28000);
      setCurrency('COP');
      setPurchaseDate(today);
      setExpirationDate(addDaysToDate(today, 30));
      setSupplierName('Digital Key Mayorista');
      setSupplierPhone('');
      setSupplierContactType('WhatsApp');
      setPaymentMethod('Nequi');
      setStatus('active');
      setProfilesCount(4);
      setWarrantyDays(30);
      setWarrantyNotes('Garantía de reposición ante caídas');
      setNotes('');

      // Generate default 4 profiles
      generateDefaultProfiles(4);
    }
  }, [initialAccount, isOpen]);

  const generateDefaultProfiles = (count: number) => {
    const list: AccountProfile[] = [];
    for (let i = 1; i <= count; i++) {
      list.push({
        id: `prof_${Date.now()}_${i}`,
        profileNumber: i,
        name: `Perfil ${i}`,
        pin: '',
        assignedToClient: '',
        clientPhone: '',
        status: 'disponible',
      });
    }
    setProfiles(list);
  };

  // When profilesCount changes, adjust the profiles array
  const handleProfilesCountChange = (newCount: number) => {
    const safeCount = Math.max(1, Math.min(8, newCount));
    setProfilesCount(safeCount);

    setProfiles((prev) => {
      const copy = [...prev];
      if (copy.length < safeCount) {
        for (let i = copy.length + 1; i <= safeCount; i++) {
          copy.push({
            id: `prof_${Date.now()}_${i}`,
            profileNumber: i,
            name: `Perfil ${i}`,
            pin: '',
            assignedToClient: '',
            clientPhone: '',
            status: 'disponible',
          });
        }
      } else if (copy.length > safeCount) {
        copy.splice(safeCount);
      }
      return copy;
    });
  };

  const handleProfileFieldChange = (
    index: number,
    field: keyof AccountProfile,
    value: string
  ) => {
    setProfiles((prev) => {
      const updated = [...prev];
      if (field === 'status') {
        updated[index] = { ...updated[index], status: value as 'disponible' | 'ocupado' };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  // Helper to generate a secure random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  // Quick expiration helpers
  const setExpirationDays = (days: number) => {
    setExpirationDate(addDaysToDate(purchaseDate || getTodayDateString(), days));
  };

  const setExpirationMonths = (months: number) => {
    setExpirationDate(addMonthsToDate(purchaseDate || getTodayDateString(), months));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert('Por favor introduce el correo de la cuenta.');
      return;
    }
    if (!password.trim()) {
      alert('Por favor introduce la contraseña de la cuenta.');
      return;
    }

    const updatedAccount: StreamingAccount = {
      id: initialAccount?.id || `acc_${Date.now()}`,
      service,
      customServiceName: service === 'Otro' ? customServiceName : undefined,
      email: email.trim(),
      password: password.trim(),
      purchasePrice: Number(purchasePrice) || 0,
      salePrice: Number(salePrice) || 0,
      currency,
      purchaseDate,
      expirationDate,
      supplierName: supplierName.trim() || 'Proveedor General',
      supplierPhone: supplierPhone.trim() || undefined,
      supplierContactType,
      paymentMethod,
      status,
      profilesCount,
      profiles,
      warrantyDays: Number(warrantyDays) || 0,
      warrantyNotes: warrantyNotes.trim() || undefined,
      notes: notes.trim() || undefined,
      renewalHistory: initialAccount?.renewalHistory || [],
      createdAt: initialAccount?.createdAt || purchaseDate,
      updatedAt: getTodayDateString(),
    };

    onSave(updatedAccount);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialAccount ? 'Editar Cuenta Streaming' : 'Registrar Nueva Cuenta'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Control completo de credenciales, proveedor, perfiles y vencimiento
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {/* SECTION 1: SERVICIO & CREDENCIALES */}
          <div className="space-y-4">
            <div className="text-[11px] font-semibold text-blue-600 tracking-wider flex items-center gap-1.5 border-b border-blue-100 pb-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>SERVICIO Y CREDENCIALES</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Service Select */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Plataforma / Servicio <span className="text-rose-500">*</span>
                </label>
                <select
                  value={service}
                  onChange={(e) => {
                    const newSrv = e.target.value as StreamingServiceType;
                    setService(newSrv);
                    const cfg = SERVICES_CONFIG[newSrv];
                    if (cfg && !initialAccount) {
                      handleProfilesCountChange(cfg.defaultProfiles);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {SERVICE_LIST.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Service Name if 'Otro' */}
              {service === 'Otro' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Nombre del Servicio Personalizado
                  </label>
                  <input
                    type="text"
                    value={customServiceName}
                    onChange={(e) => setCustomServiceName(e.target.value)}
                    placeholder="Ej. Deezer, Crunchyroll Fan..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Estado de la Cuenta
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AccountStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="active">Activa</option>
                    <option value="expiring_soon">Por Vencer</option>
                    <option value="expired">Vencida</option>
                    <option value="warranty_claim">En Reclamo / Garantía</option>
                    <option value="cancelled">Inactiva</option>
                  </select>
                </div>
              )}
            </div>

            {/* Email and Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Correo / Usuario de Acceso <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@streaming.com"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700">
                    Contraseña <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Generar aleatoria
                  </button>
                </div>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña segura"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PROVEEDOR Y COSTOS */}
          <div className="space-y-4">
            <div className="text-[11px] font-semibold text-blue-600 tracking-wider flex items-center gap-1.5 border-b border-blue-100 pb-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>PROVEEDOR Y PAGOS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Nombre del Proveedor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Ej. Digital Key Mayorista"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Teléfono / WhatsApp Proveedor
                </label>
                <input
                  type="text"
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Método de Pago Usado
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prices & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Precio de Compra (Costo) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono tabular-nums focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Precio Venta Total (Opcional)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  placeholder="Para cálculo de ganancia"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono tabular-nums focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Moneda
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="COP">COP ($ Peso Colombiano)</option>
                  <option value="USD">USD ($ Dólar)</option>
                  <option value="EUR">EUR (€ Euro)</option>
                  <option value="MXN">MXN ($ Peso Mexicano)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: VENCIMIENTO Y GARANTÍA */}
          <div className="space-y-4">
            <div className="text-[11px] font-semibold text-blue-600 tracking-wider flex items-center gap-1.5 border-b border-blue-100 pb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>FECHAS Y CONTROL DE VENCIMIENTO</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Fecha de Alta (Compra) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700">
                    Fecha de Vencimiento <span className="text-rose-500">*</span>
                  </label>
                  {/* Quick helpers */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setExpirationDays(30)}
                      className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-700 font-medium"
                    >
                      +30 Días
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpirationMonths(2)}
                      className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-700 font-medium"
                    >
                      +2 Meses
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpirationMonths(3)}
                      className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-700 font-medium"
                    >
                      +3 Meses
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Warranty fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Días de Garantía Proveedor
                </label>
                <input
                  type="number"
                  min="0"
                  value={warrantyDays}
                  onChange={(e) => setWarrantyDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono tabular-nums focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Condiciones / Términos de Garantía
                </label>
                <input
                  type="text"
                  value={warrantyNotes}
                  onChange={(e) => setWarrantyNotes(e.target.value)}
                  placeholder="Ej: Reposición si cae, garantía 30 días exacta..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: PERFILES Y PANTALLAS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-1.5">
              <div className="text-[11px] font-semibold text-blue-600 tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>PANTALLAS / PERFILES DE LA CUENTA ({profiles.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Cantidad:</span>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleProfilesCountChange(num)}
                    className={`w-6 h-6 rounded text-xs font-mono font-bold transition-colors ${
                      profilesCount === num
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {profiles.map((prof, idx) => (
                <div
                  key={prof.id || idx}
                  className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                >
                  <div className="sm:col-span-3">
                    <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">
                      Nombre Perfil
                    </span>
                    <input
                      type="text"
                      value={prof.name}
                      onChange={(e) => handleProfileFieldChange(idx, 'name', e.target.value)}
                      placeholder={`Perfil ${idx + 1}`}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800 text-xs font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">
                      PIN Acceso
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      value={prof.pin || ''}
                      onChange={(e) => handleProfileFieldChange(idx, 'pin', e.target.value)}
                      placeholder="Ej. 1234"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">
                      Cliente Asignado
                    </span>
                    <input
                      type="text"
                      value={prof.assignedToClient || ''}
                      onChange={(e) =>
                        handleProfileFieldChange(idx, 'assignedToClient', e.target.value)
                      }
                      placeholder="Nombre del cliente..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">
                      Estado
                    </span>
                    <select
                      value={prof.status}
                      onChange={(e) => handleProfileFieldChange(idx, 'status', e.target.value)}
                      className={`w-full px-2 py-1.5 border rounded-md text-xs font-semibold ${
                        prof.status === 'ocupado'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <option value="disponible">🟢 Libre / Disponible</option>
                      <option value="ocupado">🔵 Asignado / Vendido</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: NOTAS INTERNAS */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-700">
              Notas y Observaciones Internas
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas sobre el correo de recuperación, número de pedido del proveedor, etc..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
            >
              {initialAccount ? 'Guardar Cambios' : 'Registrar Cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
