import { AccountStatus, StreamingAccount, AccountProfile } from '../types';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysToDate(dateString: string, days: number): string {
  const parts = dateString.split('-').map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addMonthsToDate(dateString: string, months: number): string {
  const parts = dateString.split('-').map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  date.setMonth(date.getMonth() + months);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns number of whole calendar days remaining until expiration.
 * Positive = days left
 * 0 = expires today
 * Negative = expired N days ago
 */
export function getDaysRemaining(expirationDateStr: string): number {
  if (!expirationDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = expirationDateStr.split('-').map(Number);
  if (parts.length < 3) return 0;
  const expDate = new Date(parts[0], parts[1] - 1, parts[2]);
  expDate.setHours(0, 0, 0, 0);

  const diffTime = expDate.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Compute the effective status based on expiration date unless manually marked as claim or cancelled
 */
export function getEffectiveStatus(account: StreamingAccount): AccountStatus {
  if (account.status === 'warranty_claim') return 'warranty_claim';
  if (account.status === 'cancelled') return 'cancelled';

  const days = getDaysRemaining(account.expirationDate);
  if (days < 0) return 'expired';
  if (days <= 5) return 'expiring_soon';
  return 'active';
}

export function formatCurrency(amount: number, currency: string = 'COP'): string {
  if (currency === 'COP') {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  }
  if (currency === 'EUR') {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  }
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-').map(Number);
  if (parts.length < 3) return dateStr;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getStatusLabel(status: AccountStatus): { text: string; bg: string; textClass: string; dot: string } {
  switch (status) {
    case 'active':
      return {
        text: 'Activa',
        bg: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        dot: 'bg-emerald-500',
      };
    case 'expiring_soon':
      return {
        text: 'Por Vencer',
        bg: 'bg-amber-50',
        textClass: 'text-amber-700',
        dot: 'bg-amber-500',
      };
    case 'expired':
      return {
        text: 'Vencida',
        bg: 'bg-rose-50',
        textClass: 'text-rose-700',
        dot: 'bg-rose-500',
      };
    case 'warranty_claim':
      return {
        text: 'En Garantía / Reclamo',
        bg: 'bg-purple-50',
        textClass: 'text-purple-700',
        dot: 'bg-purple-500',
      };
    case 'cancelled':
      return {
        text: 'Inactiva',
        bg: 'bg-slate-100',
        textClass: 'text-slate-600',
        dot: 'bg-slate-400',
      };
  }
}

/**
 * Generates an elegant WhatsApp ready template for client delivery
 */
export function generateClientDeliveryMessage(account: StreamingAccount, profile?: AccountProfile): string {
  const serviceName = account.customServiceName || account.service;
  const expDateFormatted = formatDateDisplay(account.expirationDate);
  const daysLeft = getDaysRemaining(account.expirationDate);

  let msg = `✨ *MTC STREAM CONTROL - ENTREGA DE CUENTA* ✨\n\n`;
  msg += `📺 *Servicio:* ${serviceName}\n`;
  msg += `📧 *Correo:* ${account.email}\n`;
  msg += `🔑 *Contraseña:* ${account.password}\n`;

  if (profile) {
    msg += `👤 *Perfil Asignado:* ${profile.name}\n`;
    if (profile.pin) {
      msg += `🔒 *PIN de Acceso:* ${profile.pin}\n`;
    }
  }

  msg += `📅 *Vencimiento:* ${expDateFormatted} (${daysLeft > 0 ? `${daysLeft} días restantes` : 'Vence hoy'})\n\n`;
  msg += `⚠️ *Reglas de Uso:*\n`;
  msg += `• No modificar correo ni contraseña.\n`;
  msg += `• Ingresar únicamente al perfil asignado.\n`;
  msg += `• Disfruta tu contenido sin interrupciones.\n\n`;
  msg += `¡Gracias por tu compra! Para soporte o renovación contáctanos aquí.`;

  return msg;
}

/**
 * Generates an elegant WhatsApp ready template for supplier warranty claim
 */
export function generateSupplierClaimMessage(account: StreamingAccount): string {
  const serviceName = account.customServiceName || account.service;
  const altaFormatted = formatDateDisplay(account.purchaseDate);
  const expFormatted = formatDateDisplay(account.expirationDate);

  let msg = `Hola ${account.supplierName || 'Proveedor'}, cordial saludo.\n\n`;
  msg += `Tengo un reporte / solicitud de garantía para la siguiente cuenta:\n\n`;
  msg += `📺 *Servicio:* ${serviceName}\n`;
  msg += `📧 *Correo:* ${account.email}\n`;
  msg += `🔑 *Contraseña:* ${account.password}\n`;
  msg += `📅 *Fecha de Compra:* ${altaFormatted}\n`;
  msg += `⏳ *Fecha de Vencimiento:* ${expFormatted}\n`;
  msg += `💳 *Método de Pago usado:* ${account.paymentMethod}\n`;
  if (account.warrantyDays) {
    msg += `🛡️ *Garantía acordada:* ${account.warrantyDays} días\n`;
  }
  msg += `\n*Motivo:* La cuenta presenta caída / clave incorrecta / requiere código. Por favor me confirmas solución o reposición. Quedo atento, muchas gracias!`;

  return msg;
}
