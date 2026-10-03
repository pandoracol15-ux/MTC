import React, { useState, useMemo, useEffect } from 'react';
import { StreamingAccount } from './types';
import {
  getSavedAccounts,
  saveAccounts,
  resetToSampleAccounts,
} from './utils/storage';
import {
  getEffectiveStatus,
  addDaysToDate,
  getTodayDateString,
  getDaysRemaining,
} from './utils/formatters';
import { Navbar } from './components/Navbar';
import { MetricsCards } from './components/MetricsCards';
import { FilterToolbar } from './components/FilterToolbar';
import { AccountCard } from './components/AccountCard';
import { AccountTable } from './components/AccountTable';
import { AccountModal } from './components/AccountModal';
import { AccountDetailsModal } from './components/AccountDetailsModal';
import { SuppliersModal } from './components/SuppliersModal';
import { BackupModal } from './components/BackupModal';
import { FinanceView } from './components/FinanceView';
import { Plus, Tv, Sparkles } from 'lucide-react';

export default function App() {
  const [accounts, setAccounts] = useState<StreamingAccount[]>(() => getSavedAccounts());
  const [activeTab, setActiveTab] = useState<'cuentas' | 'proveedores' | 'metricas'>('cuentas');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [sortBy, setSortBy] = useState('exp_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<StreamingAccount | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [inspectAccount, setInspectAccount] = useState<StreamingAccount | null>(null);

  const [isSuppliersModalOpen, setIsSuppliersModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Keep localStorage synchronized whenever accounts change
  useEffect(() => {
    saveAccounts(accounts);
  }, [accounts]);

  // Extract distinct supplier names for filtering
  const availableSuppliers = useMemo(() => {
    const set = new Set<string>();
    accounts.forEach((acc) => {
      if (acc.supplierName) set.add(acc.supplierName);
    });
    return Array.from(set).sort();
  }, [accounts]);

  // Calculate expiring counts for notification badge
  const expiringCount = useMemo(() => {
    return accounts.filter((acc) => getEffectiveStatus(acc) === 'expiring_soon').length;
  }, [accounts]);

  // Filtered and sorted accounts list
  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((acc) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchEmail = acc.email.toLowerCase().includes(q);
          const matchService = (acc.customServiceName || acc.service).toLowerCase().includes(q);
          const matchSupplier = (acc.supplierName || '').toLowerCase().includes(q);
          const matchNotes = (acc.notes || '').toLowerCase().includes(q);
          const matchProfiles = (acc.profiles || []).some(
            (p) =>
              (p.assignedToClient || '').toLowerCase().includes(q) ||
              (p.name || '').toLowerCase().includes(q) ||
              (p.pin || '').includes(q)
          );

          if (!matchEmail && !matchService && !matchSupplier && !matchNotes && !matchProfiles) {
            return false;
          }
        }

        // Service filter
        if (selectedService !== 'all' && acc.service !== selectedService) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all') {
          const effStatus = getEffectiveStatus(acc);
          if (effStatus !== selectedStatus) return false;
        }

        // Supplier filter
        if (selectedSupplier !== 'all' && acc.supplierName !== selectedSupplier) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'exp_asc') {
          return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
        }
        if (sortBy === 'exp_desc') {
          return new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime();
        }
        if (sortBy === 'alta_desc') {
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        }
        if (sortBy === 'price_desc') {
          return (Number(b.purchasePrice) || 0) - (Number(a.purchasePrice) || 0);
        }
        if (sortBy === 'service_asc') {
          return (a.customServiceName || a.service).localeCompare(
            b.customServiceName || b.service
          );
        }
        return 0;
      });
  }, [accounts, searchQuery, selectedService, selectedStatus, selectedSupplier, sortBy]);

  // Handlers
  const handleSaveAccount = (accountToSave: StreamingAccount) => {
    setAccounts((prev) => {
      const exists = prev.some((a) => a.id === accountToSave.id);
      if (exists) {
        return prev.map((a) => (a.id === accountToSave.id ? accountToSave : a));
      }
      return [accountToSave, ...prev];
    });

    // If currently inspecting, update the inspected copy too
    if (inspectAccount?.id === accountToSave.id) {
      setInspectAccount(accountToSave);
    }
  };

  const handleDeleteAccount = (accountId: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== accountId));
    if (inspectAccount?.id === accountId) {
      setIsDetailsModalOpen(false);
      setInspectAccount(null);
    }
  };

  const handleRenewQuick = (account: StreamingAccount) => {
    const today = getTodayDateString();
    // If account was already expired, extend from today; otherwise extend from expirationDate
    const baseDate = getDaysRemaining(account.expirationDate) < 0 ? today : account.expirationDate;
    const newExpDate = addDaysToDate(baseDate, 30);

    const updated: StreamingAccount = {
      ...account,
      expirationDate: newExpDate,
      status: 'active',
      renewalHistory: [
        ...(account.renewalHistory || []),
        {
          id: `ren_${Date.now()}`,
          date: today,
          cost: account.purchasePrice,
          durationDays: 30,
          extendedUntil: newExpDate,
          paymentMethod: account.paymentMethod,
          note: 'Renovación rápida +30 días',
        },
      ],
      updatedAt: today,
    };

    handleSaveAccount(updated);
    alert(`¡Cuenta ${account.email} renovada por 30 días! Nueva fecha de vencimiento: ${newExpDate}`);
  };

  const handleOpenEdit = (account: StreamingAccount) => {
    setEditingAccount(account);
    setIsAccountModalOpen(true);
  };

  const handleOpenDetails = (account: StreamingAccount) => {
    setInspectAccount(account);
    setIsDetailsModalOpen(true);
  };

  const handleResetData = () => {
    const fresh = resetToSampleAccounts();
    setAccounts(fresh);
    alert('Se han eliminado todas las cuentas. El sistema está limpio y listo para registrar tus cuentas.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'proveedores') {
            setIsSuppliersModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenNewAccount={() => {
          setEditingAccount(null);
          setIsAccountModalOpen(true);
        }}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        totalAccounts={accounts.length}
        expiringCount={expiringCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB: CUENTAS */}
        {activeTab === 'cuentas' && (
          <div>
            {/* Top KPI Metrics Overview */}
            <MetricsCards
              accounts={accounts}
              onFilterStatus={(status) => {
                setSelectedStatus(status);
              }}
            />

            {/* Filter & Search Toolbar */}
            <FilterToolbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedSupplier={selectedSupplier}
              setSelectedSupplier={setSelectedSupplier}
              availableSuppliers={availableSuppliers}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              filteredCount={filteredAccounts.length}
              totalCount={accounts.length}
            />

            {/* Accounts Content: Grid or Table */}
            {filteredAccounts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Tv className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {accounts.length === 0
                    ? 'No tienes cuentas de streaming registradas'
                    : 'No se encontraron cuentas con estos filtros'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  {accounts.length === 0
                    ? 'Comienza agregando tu primera cuenta de Disney+, YouTube Premium, Netflix u otro proveedor.'
                    : 'Intenta limpiar la barra de búsqueda o cambiar los filtros de estado y servicio.'}
                </p>

                {accounts.length === 0 ? (
                  <button
                    onClick={() => {
                      setEditingAccount(null);
                      setIsAccountModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Registrar Primera Cuenta</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedService('all');
                      setSelectedStatus('all');
                      setSelectedSupplier('all');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Limpiar Filtros</span>
                  </button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAccounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteAccount}
                    onRenewQuick={handleRenewQuick}
                    onViewDetails={handleOpenDetails}
                  />
                ))}
              </div>
            ) : (
              <AccountTable
                accounts={filteredAccounts}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteAccount}
                onRenewQuick={handleRenewQuick}
                onViewDetails={handleOpenDetails}
              />
            )}
          </div>
        )}

        {/* TAB: FINANZAS & ESTADÍSTICAS */}
        {activeTab === 'metricas' && <FinanceView accounts={accounts} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">MTC Stream Control</span>
            <span aria-hidden="true">·</span>
            <span>Gestión integral de streaming para revendedores y distribuidores</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Privacidad y almacenamiento local</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Exportar Datos
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Create / Edit Account Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => {
          setIsAccountModalOpen(false);
          setEditingAccount(null);
        }}
        onSave={handleSaveAccount}
        initialAccount={editingAccount}
      />

      {/* 2. Detailed Account View & WhatsApp Templates */}
      <AccountDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setInspectAccount(null);
        }}
        account={inspectAccount}
        onUpdateAccount={handleSaveAccount}
      />

      {/* 3. Suppliers Directory Modal */}
      <SuppliersModal
        isOpen={isSuppliersModalOpen}
        onClose={() => setIsSuppliersModalOpen(false)}
        accounts={accounts}
        onSelectSupplierFilter={(supplierName) => {
          setActiveTab('cuentas');
          setSelectedSupplier(supplierName);
        }}
      />

      {/* 4. Backup & CSV Export Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        accounts={accounts}
        onImportAccounts={(imported) => {
          setAccounts(imported);
          alert(`Se importaron ${imported.length} cuentas con éxito.`);
        }}
        onResetAccounts={handleResetData}
      />
    </div>
  );
}
