import { isRecord } from '../../../utils/record';
import type {
  AppSection,
  CouponBanner,
  HomeCoupon,
  NearbyPharmacy,
  SectionImage,
  WalletSnapshot,
} from '../types/home';

const rejected = 'Home could not be read';

export function parseAppSections(payload: unknown): AppSection[] {
  if (!isRecord(payload) || !Array.isArray(payload.sections)) throw new Error(rejected);
  return payload.sections.map(readSection);
}

export function parseNearbyPharmacies(payload: unknown): NearbyPharmacy[] {
  if (!isRecord(payload) || !Array.isArray(payload.pharmacies)) throw new Error(rejected);
  return payload.pharmacies.map(readPharmacy);
}

export function parseWallet(payload: unknown): WalletSnapshot {
  if (!isRecord(payload)) throw new Error(rejected);
  return {
    balance: readInteger(payload, 'balance'),
    referralCode: readString(payload, 'referralCode'),
    referrerCode: readOptionalString(payload, 'referrerCode'),
  };
}

export function parseCoupons(payload: unknown): HomeCoupon[] {
  if (!isRecord(payload) || !Array.isArray(payload.coupons)) throw new Error(rejected);
  return payload.coupons.flatMap((item) => {
    const coupon = readCoupon(item);
    return coupon === null ? [] : [coupon];
  });
}

function readSection(value: unknown): AppSection {
  if (!isRecord(value)) throw new Error(rejected);
  return {
    id: readString(value, 'id'),
    category: readString(value, 'category'),
    position: readPosition(value.position),
    image: readImage(value.image),
  };
}

function readImage(value: unknown): SectionImage {
  if (!isRecord(value)) throw new Error(rejected);
  return {
    contentType: readString(value, 'contentType'),
    url: readString(value, 'url'),
  };
}

function readCoupon(value: unknown): HomeCoupon | null {
  if (!isRecord(value)) throw new Error(rejected);
  if (!readBoolean(value, 'active')) return null;
  return {
    id: readString(value, 'id'),
    title: readString(value, 'title'),
    code: readString(value, 'code'),
    banner: readBanner(value.banner),
  };
}

function readBanner(value: unknown): CouponBanner {
  if (!isRecord(value)) throw new Error(rejected);
  return {
    contentType: readString(value, 'contentType'),
    url: readString(value, 'url'),
  };
}

function readPharmacy(value: unknown): NearbyPharmacy {
  if (!isRecord(value)) throw new Error(rejected);
  return {
    pharmacyId: readString(value, 'pharmacyId'),
    name: readOptionalString(value, 'name'),
    address: readOptionalString(value, 'address'),
    city: readOptionalString(value, 'city'),
    state: readOptionalString(value, 'state'),
    pincode: readOptionalString(value, 'pincode'),
    latitude: readNumber(value, 'latitude'),
    longitude: readNumber(value, 'longitude'),
    distanceKm: readNumber(value, 'distanceKm'),
    acceptOnlineOrders: readBoolean(value, 'acceptOnlineOrders'),
  };
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.length === 0) throw new Error(rejected);
  return value;
}

function readOptionalString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (value === null) return null;
  if (typeof value !== 'string') throw new Error(rejected);
  return value;
}

function readInteger(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isInteger(value)) throw new Error(rejected);
  return value;
}

function readPosition(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) throw new Error(rejected);
  return value;
}

function readNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(rejected);
  return value;
}

function readBoolean(record: Record<string, unknown>, key: string): boolean {
  const value = record[key];
  if (typeof value !== 'boolean') throw new Error(rejected);
  return value;
}
