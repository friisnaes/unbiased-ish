import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { da } from 'date-fns/locale';
import type { DivergenceLevel } from '@/types';

export function timeAgo(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: da });
  } catch {
    return '';
  }
}

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'd. MMMM yyyy, HH:mm', { locale: da });
  } catch {
    return '';
  }
}

export function formatDateShort(iso: string): string {
  try {
    return format(parseISO(iso), 'd. MMM HH:mm', { locale: da });
  } catch {
    return '';
  }
}

export function divergenceColor(level: DivergenceLevel): string {
  const map: Record<DivergenceLevel, string> = {
    low: 'text-divergence-low',
    moderate: 'text-divergence-moderate',
    high: 'text-divergence-high',
  };
  return map[level];
}

export function divergenceBg(level: DivergenceLevel): string {
  const map: Record<DivergenceLevel, string> = {
    low: 'bg-divergence-low/15',
    moderate: 'bg-divergence-moderate/15',
    high: 'bg-divergence-high/15',
  };
  return map[level];
}

export function divergenceLabelDa(level: DivergenceLevel): string {
  const map: Record<DivergenceLevel, string> = {
    low: 'Lav divergens',
    moderate: 'Moderat divergens',
    high: 'Høj divergens',
  };
  return map[level];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[æ]/g, 'ae')
    .replace(/[ø]/g, 'oe')
    .replace(/[å]/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max).replace(/\s+\S*$/, '') + '…';
}
