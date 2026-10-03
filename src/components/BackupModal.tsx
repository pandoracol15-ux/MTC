import React, { useState, useRef } from 'react';
import { StreamingAccount } from '../types';
import { exportAccountsToCSV, exportAccountsToJSON, resetToSampleAccounts } from '../utils/storage';
import { X, Download, FileSpreadsheet, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: StreamingAccount[];
  onImportAccounts: (imported: StreamingAccount[]) => void;
  onResetAccounts: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onImportAccounts,
  onResetAccounts,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          throw new Error('El archivo no contiene un formato de lista válido.');
        }

        // Basic validation
        const valid = parsed.every((item) => item.email && item.service);
        if (!valid) {
          throw new Error('El archivo contiene cuentas incompletas (falta email o servicio).');
        }

        onImportAccounts(parsed);
        setImportStatus(`Se importaron ${parsed.length} cuentas exitosamente.`);
        setErrorMessage(null);
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 1800);
      } catch (err: any) {
        setErrorMessage(err.message || 'Error al procesar el archivo JSON.');
        setImportStatus(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">Respaldos & Exportación</h2>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Descarga reportes para Excel o guarda copias de seguridad de tus cuentas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {importStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Export to CSV */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Exportar Reporte a Excel (CSV)
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Hoja de cálculo con todos los correos, claves, fechas, proveedores y costos.
              </p>
            </div>
            <button
              onClick={() => exportAccountsToCSV(accounts)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar CSV</span>
            </button>
          </div>

          {/* Export to JSON */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-600" />
                Copia de Seguridad Completa (JSON)
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Respaldo completo con estructura de perfiles, pines e historial para restaurar.
              </p>
            </div>
            <button
              onClick={() => exportAccountsToJSON(accounts)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Guardar JSON</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-slate-700" />
                Restaurar desde Respaldo JSON
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Carga un archivo JSON previamente exportado.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Cargar JSON</span>
            </button>
          </div>

          {/* Clear All Accounts */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">
              ¿Deseas vaciar todas las cuentas registradas?
            </span>
            <button
              onClick={() => {
                if (confirm('¿Estás seguro de que deseas eliminar todas las cuentas? Esta acción borrará todas las cuentas del sistema.')) {
                  onResetAccounts();
                  onClose();
                }
              }}
              className="text-rose-600 hover:text-rose-700 font-semibold text-[11px] flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Vaciar Todas las Cuentas</span>
            </button>
          </div>
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
