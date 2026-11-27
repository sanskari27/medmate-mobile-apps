export type SectionImage = {
  contentType: string;
  url: string;
};

export type AppSection = {
  id: string;
  category: string;
  position: number;
  image: SectionImage;
};

export function pharmacyTitle(name: string | null, fallback: string): string {
  return name || fallback;
}

export function pharmacyInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const first = words[0];
  if (first === undefined) return '';
  const humps = first.match(/[A-Z]/g);
  if (humps !== null && humps.length >= 2) return `${humps[0]}${humps[1]}`;
  const second = words[1];
  if (second !== undefined) return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
  return first.slice(0, 2).toUpperCase();
}

export type CouponBanner = {
  contentType: string;
  url: string;
};

export type WalletSnapshot = {
  balance: number;
  referralCode: string;
  referrerCode: string | null;
};

export type HomeCoupon = {
  id: string;
  title: string;
  code: string;
  banner: CouponBanner;
};

export type NearbyPharmacy = {
  pharmacyId: string;
  name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  latitude: number;
  longitude: number;
  distanceKm: number;
  acceptOnlineOrders: boolean;
};
