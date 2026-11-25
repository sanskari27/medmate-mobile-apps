import clsx, { type ClassValue } from 'clsx';

/** Join class names. Falsy values are dropped. Tailwind merge is intentionally not applied. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
