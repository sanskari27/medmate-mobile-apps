/**
 * Icon geometry, lifted from the MedMate web MVP so the native app and the
 * live product share one icon set.
 *
 * Every glyph is drawn on a 24 x 24 grid as stroked paths (no fills), which
 * matches the MVP's Lucide rendering: `fill="none"`, `stroke="currentColor"`,
 * round caps and joins, 1.8pt stroke.
 *
 * Generated file - do not edit by hand.
 */

export type IconCircle = { cx: number; cy: number; r: number };

export type IconGlyph = {
  /** Stroked path data, in the 24 x 24 coordinate space. */
  paths: readonly string[];
  /** Stroked circles, in the 24 x 24 coordinate space. */
  circles: readonly IconCircle[];
};

export const iconGlyphs = {
  alert: {
    paths: [
      'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
      'M12 9v4',
      'M12 17h.01',
    ],
    circles: [],
  },
  'arrow-left': {
    paths: ['M19 12H5', 'm12 19-7-7 7-7'],
    circles: [],
  },
  'badge-check': {
    paths: [
      'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
      'M7 7h.01',
    ],
    circles: [],
  },
  bag: {
    paths: [
      'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z',
      'M3 6h18',
      'M16 10a4 4 0 0 1-8 0',
    ],
    circles: [],
  },
  bell: {
    paths: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
    circles: [],
  },
  bolt: {
    paths: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
    circles: [],
  },
  box: {
    paths: [
      'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
      'M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
    ],
    circles: [],
  },
  briefcase: {
    paths: ['M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
    circles: [],
  },
  camera: {
    paths: ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'],
    circles: [{ cx: 12.0, cy: 13.0, r: 4.0 }],
  },
  card: {
    paths: ['M2 10h20'],
    circles: [],
  },
  cash: {
    paths: ['M6 12h.01M18 12h.01'],
    circles: [{ cx: 12.0, cy: 12.0, r: 2.5 }],
  },
  chat: {
    paths: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
    circles: [],
  },
  check: {
    paths: ['M20 6L9 17l-5-5'],
    circles: [],
  },
  'chev-d': {
    paths: ['M6 9l6 6 6-6'],
    circles: [],
  },
  'chev-l': {
    paths: ['M15 18l-6-6 6-6'],
    circles: [],
  },
  'chev-r': {
    paths: ['M9 18l6-6-6-6'],
    circles: [],
  },
  clock: {
    paths: ['M12 6v6l4 2'],
    circles: [{ cx: 12.0, cy: 12.0, r: 10.0 }],
  },
  edit: {
    paths: ['M12 20h9', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'],
    circles: [],
  },
  flask: {
    paths: ['M9 2h6M10 2v7L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9V2', 'M7 16h10'],
    circles: [],
  },
  gift: {
    paths: [
      'M20 12v10H4V12',
      'M2 7h20v5H2z',
      'M12 22V7',
      'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z',
      'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
    ],
    circles: [],
  },
  heart: {
    paths: [
      'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    ],
    circles: [],
  },
  help: {
    paths: ['M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'],
    circles: [{ cx: 12.0, cy: 12.0, r: 10.0 }],
  },
  home: {
    paths: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
    circles: [],
  },
  id: {
    paths: ['M5 16c.5-1.5 1.7-2 3-2s2.5.5 3 2M14 10h4M14 14h4'],
    circles: [{ cx: 8.0, cy: 11.0, r: 2.0 }],
  },
  image: {
    paths: ['M21 15l-5-5L5 21'],
    circles: [{ cx: 8.5, cy: 8.5, r: 1.5 }],
  },
  info: {
    paths: ['M12 16v-4M12 8h.01'],
    circles: [{ cx: 12.0, cy: 12.0, r: 10.0 }],
  },
  logout: {
    paths: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'],
    circles: [],
  },
  mic: {
    paths: ['M5 11a7 7 0 0 0 14 0', 'M12 18v4'],
    circles: [],
  },
  minus: {
    paths: ['M5 12h14'],
    circles: [],
  },
  percent: {
    paths: ['M19 5L5 19'],
    circles: [
      { cx: 6.5, cy: 6.5, r: 2.5 },
      { cx: 17.5, cy: 17.5, r: 2.5 },
    ],
  },
  phone: {
    paths: [
      'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
    ],
    circles: [],
  },
  pill: {
    paths: ['M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z', 'M8.5 8.5l7 7'],
    circles: [],
  },
  pin: {
    paths: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'],
    circles: [{ cx: 12.0, cy: 10.0, r: 3.0 }],
  },
  play: {
    paths: ['M6 4l14 8-14 8z'],
    circles: [],
  },
  plus: {
    paths: ['M12 5v14M5 12h14'],
    circles: [],
  },
  refill: {
    paths: [
      'M23 4v6h-6',
      'M1 20v-6h6',
      'M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
    ],
    circles: [],
  },
  'rx-doc': {
    paths: [
      'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
      'M14 2v6h6',
      'M12 13v4',
      'M9 15h6',
    ],
    circles: [],
  },
  'rx-up': {
    paths: [
      'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
      'M14 2v6h6',
      'M12 18v-6',
      'M9 15l3-3 3 3',
    ],
    circles: [],
  },
  scooter: {
    paths: ['M15 6h2l3 8', 'M5.5 17.5L9 10h6l3.5 7.5', 'M9 10L7 6H4'],
    circles: [
      { cx: 5.5, cy: 17.5, r: 3.5 },
      { cx: 18.5, cy: 17.5, r: 3.5 },
    ],
  },
  search: {
    paths: ['M21 21l-4.35-4.35'],
    circles: [{ cx: 11.0, cy: 11.0, r: 8.0 }],
  },
  share: {
    paths: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'],
    circles: [],
  },
  shield: {
    paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M9 12l2 2 4-4'],
    circles: [],
  },
  speaker: {
    paths: ['M11 5 6 9H2v6h4l5 4z', 'M15.5 8.5a5 5 0 0 1 0 7', 'M19 5a9 9 0 0 1 0 14'],
    circles: [],
  },
  star: {
    paths: [
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    ],
    circles: [],
  },
  steth: {
    paths: [
      'M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3',
      'M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4',
    ],
    circles: [{ cx: 20.0, cy: 10.0, r: 2.0 }],
  },
  store: {
    paths: [
      'M3 9l1-5h16l1 5',
      'M4 9v11h16V9',
      'M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0',
      'M10 20v-6h4v6',
    ],
    circles: [],
  },
  tag: {
    paths: [
      'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
      'M7 7h.01',
    ],
    circles: [],
  },
  trash: {
    paths: [
      'M3 6h18',
      'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
      'M10 11v6M14 11v6',
      'M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
    ],
    circles: [],
  },
  upi: {
    paths: ['M13 17l5-5-5-5M6 17l5-5-5-5'],
    circles: [],
  },
  user: {
    paths: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'],
    circles: [{ cx: 12.0, cy: 7.0, r: 4.0 }],
  },
  video: {
    paths: ['M23 7l-7 5 7 5V7z'],
    circles: [],
  },
  wallet: {
    paths: [
      'M20 12V8H6a2 2 0 0 1 0-4h12v4',
      'M4 6v12a2 2 0 0 0 2 2h14v-4',
      'M18 12a2 2 0 0 0 0 4h4v-4z',
    ],
    circles: [],
  },
  x: {
    paths: ['M18 6L6 18M6 6l12 12'],
    circles: [],
  },
  zap: {
    paths: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
    circles: [],
  },
} as const satisfies Record<string, IconGlyph>;

export type IconName = keyof typeof iconGlyphs;
