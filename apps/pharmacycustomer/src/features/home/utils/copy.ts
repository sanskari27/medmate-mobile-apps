export const deliveryWindow = 'Delivery in 32–47 min';
export const searchLabel = 'Search “Vicks VapoRub”';
export const profileLabel = 'Profile';
export const profileMark = 'P';
export const walletLabel = 'Wallet';
export const alertsLabel = 'Notifications';
export const offersLabel = 'Offers';
export const sourceEyebrow = "Can't find a medicine?";
export const sourceTitle = "Tell us, we'll try to source it";
export const sourceNote = 'We call back with price and time';
export const sourceAction = 'Request it';

export const homeCategories = ['All', 'Fever & pain', 'Devices', 'Baby', 'Women'] as const;
export type HomeCategory = (typeof homeCategories)[number];

export function emailInitial(email: string | null): string {
  if (email === null) return profileMark;
  const trimmed = email.trim();
  if (trimmed.length === 0) return profileMark;
  return trimmed.charAt(0).toUpperCase();
}

export function rupee(balance: number): string {
  return `₹${balance}`;
}

export function walletAction(balance: number | null): string {
  if (balance === null) return walletLabel;
  return `${walletLabel}, ${rupee(balance)}`;
}

export function placeSummary(label: string, line: string): string {
  const trimmed = line.trim();
  if (trimmed.length === 0) return label;
  return `${label} · ${trimmed}`;
}

export const chooseAddress = 'Choose address';
export const pharmaciesLead = 'Pharmacies';
export const pharmaciesAccent = 'near you';
export const pharmaciesTitle = `${pharmaciesLead} ${pharmaciesAccent}`;
export const seeAllPharmacies = 'See all';
export const fastestLabel = 'Fastest';
export const pharmaciesEmpty = 'No pharmacies nearby';
export const pharmacyFallback = 'Pharmacy';
export const homeLoading = 'Loading home';
export const homeFailed = 'Something went wrong';
export const tryAgain = 'Try again';
export const homeTab = 'Home';
export const cartTitle = 'Cart';
export const dosageTitle = 'Dosage';
export const chatTitle = 'Chat';

export function distanceLabel(km: number): string {
  const rounded = Math.round(km * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text} km`;
}

/** 15 minutes for the first kilometre, then 5 minutes for each further kilometre. */
export function deliveryMinutes(distanceKm: number): number {
  const kilometres = Math.max(1, Math.ceil(distanceKm));
  return 15 + (kilometres - 1) * 5;
}

export function deliveryTimeLabel(distanceKm: number): string {
  return `● ${deliveryMinutes(distanceKm)} min`;
}
