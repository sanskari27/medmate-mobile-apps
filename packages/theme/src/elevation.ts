export type Elevation = {
  shadowOffset: { width: number; height: number };
  shadowRadius: number;
  shadowOpacity: number;
  elevation: number;
  shadowColor: string;
};

const INK = '#14201A';

export const elevation = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
    shadowColor: INK,
  },
  low: {
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.06,
    elevation: 1,
    shadowColor: INK,
  },
  medium: {
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 3,
    shadowColor: INK,
  },
  high: {
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.16,
    elevation: 8,
    shadowColor: INK,
  },
} as const satisfies Record<string, Elevation>;

export type ElevationToken = keyof typeof elevation;
