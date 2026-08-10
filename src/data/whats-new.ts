import type { PlatformWhatsNewRow } from '../lib/api/whats-new.api';

export type WhatsNewEntry = {
  id: string;
  year: number;
  month: string;
  date: string;
  title: string;
  body: string;
  top: number;
  markerTop: number;
  dotTop: number;
  showYear: boolean;
  monthWidth?: number;
};

export type WhatsNewFilter = {
  label: string;
  variant: 'latest' | 'filled' | 'outline';
};

/** Figma frame 2224:462 timeline geometry (1512 frame, rail at x=251) */
export const WHATS_NEW_LAYOUT = {
  lineHeight: 1198,
  firstCardOffset: 109.5,
  fadeTop: -7,
  fadeBottom: 1086,
  cardHeight: 215,
  cardGap: 42,
  rail: {
    yearX: 39,
    monthX: 99,
    dotX: 170,
    lineX: 174,
    cardX: 197,
    cardW: 813,
    fadeTopX: 153,
    fadeBottomX: 147,
  },
};

function monthPillWidth(month: string): number | undefined {
  if (month === 'July') return 43;
  if (month === 'August' || month === 'January') return 63;
  return undefined;
}

function formatEntryDate(value: string): { year: number; month: string; date: string } {
  const d = new Date(value);
  const year = d.getUTCFullYear();
  const month = d.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const day = String(d.getUTCDate()).padStart(2, '0');
  return {
    year,
    month,
    date: `${day} ${month} ${year}`,
  };
}

export function buildWhatsNewViewModel(rows: PlatformWhatsNewRow[]): {
  entries: WhatsNewEntry[];
  filters: WhatsNewFilter[];
} {
  const sorted = [...rows].sort((a, b) => {
    const dateDiff =
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.sortOrder - b.sortOrder;
  });

  let previousYear: number | null = null;
  let previousTop = 0;

  const entries = sorted.map((row, index) => {
    const { year, month, date } = formatEntryDate(row.publishedAt);
    const top =
      index === 0
        ? 0
        : previousTop + WHATS_NEW_LAYOUT.cardHeight + WHATS_NEW_LAYOUT.cardGap;
    previousTop = top;

    const showYear = previousYear === null || year !== previousYear;
    previousYear = year;

    return {
      id: row.id,
      year,
      month,
      date,
      title: row.title,
      body: row.body,
      top,
      markerTop: index === 0 ? 8.5 : 20,
      dotTop: index === 0 ? 13.5 : 24.5,
      showYear,
      monthWidth: monthPillWidth(month),
    };
  });

  const years = [...new Set(entries.map((entry) => entry.year))].sort((a, b) => b - a);
  const filters: WhatsNewFilter[] = [
    { label: 'Latest', variant: 'latest' },
    ...years.map((year, index) => ({
      label: String(year),
      variant: (index % 2 === 0 ? 'filled' : 'outline') as 'filled' | 'outline',
    })),
  ];

  return { entries, filters };
}
