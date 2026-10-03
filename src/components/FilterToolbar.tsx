import React from 'react';
import { Search, LayoutGrid, List, RotateCcw, Filter } from 'lucide-react';
import { SERVICE_LIST } from '../utils/constants';

interface FilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedSupplier: string;
  setSelectedSupplier: (supplier: string) => void;
  availableSuppliers: string[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedService,
  setSelectedService,
  selectedStatus,
  setSelectedStatus,
  selectedSupplier,
  setSelectedSupplier,
  availableSuppliers,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  filteredCount,
  totalCount,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedService !== 'all' ||
    selectedStatus !== 'all' ||
    selectedSupplier !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedService('all');
    setSelectedStatus('all');
    setSelectedSupplier('all');
    setSortBy('exp_asc');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 mb-5 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por correo, proveedor, servicio, pin, o cliente..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* View mode toggle + Quick counter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-mono tabular-nums font-semibold text-slate-900">{filteredCount}</span>
            <span>de {totalCount} cuentas</span>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
            <button
              onClick={() => setViewMode('grid')}
              title="Vista en Tarjetas"
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Vista en Tabla Compacta"
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter selectors row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1 text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span className="font-medium text-slate-500">Filtrar:</span>
        </div>

        {/* Service filter */}
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          aria-label="Filtrar por servicio"
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500"
        >
          <option value="all">Todos los Servicios</option>
          {SERVICE_LIST.map((srv) => (
            <option key={srv} value={srv}>
              {srv}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filtrar por estado"
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500"
        >
          <option value="all">Todos los Estados</option>
          <option value="active">Activas</option>
          <option value="expiring_soon">Por Vencer (&le; 5 días)</option>
          <option value="expired">Vencidas</option>
          <option value="warranty_claim">En Garantía / Reclamo</option>
          <option value="cancelled">Inactivas</option>
        </select>

        {/* Supplier filter */}
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          aria-label="Filtrar por proveedor"
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500"
        >
          <option value="all">Todos los Proveedores</option>
          {availableSuppliers.map((supp) => (
            <option key={supp} value={supp}>
              {supp}
            </option>
          ))}
        </select>

        {/* Sort by */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-slate-400">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Ordenar cuentas"
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="exp_asc">Vencimiento: más próximo</option>
            <option value="exp_desc">Vencimiento: más lejano</option>
            <option value="alta_desc">Fecha de Alta: más reciente</option>
            <option value="price_desc">Precio de compra: Mayor</option>
            <option value="service_asc">Servicio (A - Z)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors ml-1"
              title="Limpiar filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
