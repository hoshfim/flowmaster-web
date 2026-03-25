import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmt$(n: number, decimals = 2): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtK(n: number): string {
  if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return fmt$(n, 0);
}

export function relTime(iso: string | null): string {
  if (!iso) return 'never';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000)    return 'just now';
  if (diff < 3_600_000) return Math.round(diff / 60_000) + 'm ago';
  if (diff < 86_400_000) return Math.round(diff / 3_600_000) + 'h ago';
  return Math.round(diff / 86_400_000) + 'd ago';
}

export const PLAT_COLORS: Record<string, string> = {
  shopify:     '#96bf47',
  tiktok:      '#ff0050',
  amazon:      '#ff9900',
  ebay:        '#e53238',
  temu:        '#ff6b35',
  shein:       '#888888',
  woocommerce: '#7f54b3',
  lazada:      '#0f146d',
};

export const PLAT_NAMES: Record<string, string> = {
  shopify:     'Shopify',
  tiktok:      'TikTok Shop',
  amazon:      'Amazon',
  ebay:        'eBay',
  temu:        'Temu',
  shein:       'SHEIN',
  woocommerce: 'WooCommerce',
  lazada:      'Lazada',
};
