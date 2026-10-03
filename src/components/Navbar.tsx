import React from 'react';
import { Tv, Plus, Download, Users, BarChart3 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'cuentas' | 'proveedores' | 'metricas';
  setActiveTab: (tab: 'cuentas' | 'proveedores' | 'metricas') => void;
  onOpenNewAccount: () => void;
  onOpenBackup: () => void;
  totalAccounts: number;
  expiringCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewAccount,
  onOpenBackup,
  totalAccounts,
  expiringCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark with icon */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                MTC Stream Control
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Gestión y Vencimiento de Cuentas Streaming
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('cuentas')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'cuentas'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Cuentas</span>
              <span className="text-[11px] font-mono tabular-nums bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                {totalAccounts}
              </span>
              {expiringCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500" title={`${expiringCount} por vencer`} />
              )}
            </button>

            <button
              onClick={() => setActiveTab('proveedores')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'proveedores'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Proveedores</span>
            </button>

            <button
              onClick={() => setActiveTab('metricas')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'metricas'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Finanzas & Estadísticas</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenBackup}
              title="Respaldos y Reportes (CSV / JSON)"
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Exportar / Backup</span>
            </button>

            <button
              onClick={onOpenNewAccount}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-600/20 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nueva Cuenta</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2">
          <button
            onClick={() => setActiveTab('cuentas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
              activeTab === 'cuentas' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'
            }`}
          >
            Cuentas ({totalAccounts})
          </button>
          <button
            onClick={() => setActiveTab('proveedores')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
              activeTab === 'proveedores' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'
            }`}
          >
            Proveedores
          </button>
          <button
            onClick={() => setActiveTab('metricas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
              activeTab === 'metricas' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'
            }`}
          >
            Finanzas
          </button>
        </div>
      </div>
    </header>
  );
};
