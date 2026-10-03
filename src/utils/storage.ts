import { StreamingAccount } from '../types';

const STORAGE_KEY = 'mtc_stream_control_accounts_v2';
const PREVIOUS_STORAGE_KEY = 'mtc_stream_control_accounts_v1';

export const INITIAL_ACCOUNTS: StreamingAccount[] = [];

export function getSavedAccounts(): StreamingAccount[] {
  try {
    // If old test data exists in previous storage key, purge it
    if (typeof localStorage !== 'undefined' && localStorage.getItem(PREVIOUS_STORAGE_KEY)) {
      localStorage.removeItem(PREVIOUS_STORAGE_KEY);
    }

    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out any previous mock accounts (acc-1 through acc-7)
      const cleanAccounts = parsed.filter(
        (acc) => !['acc-1', 'acc-2', 'acc-3', 'acc-4', 'acc-5', 'acc-6', 'acc-7'].includes(acc.id)
      );
      return cleanAccounts;
    }
    return [];
  } catch (error) {
    console.error('Error reading localStorage accounts:', error);
    return [];
  }
}

export function saveAccounts(accounts: StreamingAccount[]): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }
  } catch (error) {
    console.error('Error saving accounts to localStorage:', error);
  }
}

export function clearAllAccounts(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PREVIOUS_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error clearing accounts from localStorage:', error);
  }
}

export function resetToSampleAccounts(): StreamingAccount[] {
  clearAllAccounts();
  return [];
}

export function exportAccountsToJSON(accounts: StreamingAccount[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(accounts, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const now = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('download', `mtc_stream_control_backup_${now}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportAccountsToCSV(accounts: StreamingAccount[]): void {
  const headers = [
    'ID',
    'Servicio',
    'Correo',
    'Contraseña',
    'Precio Compra',
    'Precio Venta',
    'Moneda',
    'Fecha Alta',
    'Fecha Vencimiento',
    'Proveedor',
    'Contacto Proveedor',
    'Metodo de Pago',
    'Estado',
    'Perfiles Totales',
    'Perfiles Ocupados',
    'Garantia Dias',
    'Notas',
  ];

  const rows = accounts.map((acc) => {
    const occupied = (acc.profiles || []).filter((p) => p.status === 'ocupado').length;
    return [
      acc.id,
      `"${acc.customServiceName || acc.service}"`,
      `"${acc.email}"`,
      `"${acc.password}"`,
      acc.purchasePrice,
      acc.salePrice || 0,
      acc.currency,
      acc.purchaseDate,
      acc.expirationDate,
      `"${acc.supplierName}"`,
      `"${acc.supplierPhone || ''}"`,
      `"${acc.paymentMethod}"`,
      acc.status,
      acc.profilesCount || 0,
      occupied,
      acc.warrantyDays || 0,
      `"${(acc.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  const now = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `mtc_stream_control_reporte_${now}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
