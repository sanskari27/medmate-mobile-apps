import { isAddressLabel, type Address, type AddressLabel } from '../types/address';

const rejected = 'Address was not accepted';

export function parseAddressList(payload: unknown): Address[] {
  if (!isRecord(payload) || !Array.isArray(payload.addresses)) {
    throw new Error(rejected);
  }
  return payload.addresses.map(readAddress);
}

export function parseAddressResponse(payload: unknown): Address {
  if (!isRecord(payload)) throw new Error(rejected);
  return readAddress(payload.address);
}

function readAddress(value: unknown): Address {
  if (!isRecord(value)) throw new Error(rejected);
  return {
    id: readString(value, 'id'),
    label: readLabel(value.label),
    line1: readString(value, 'line1'),
    line2: readString(value, 'line2'),
    landmark: readNullableString(value, 'landmark'),
    city: readString(value, 'city'),
    pincode: readString(value, 'pincode'),
    latitude: readNullableNumber(value, 'latitude'),
    longitude: readNullableNumber(value, 'longitude'),
    receiverName: readString(value, 'receiverName'),
    receiverPhone: readString(value, 'receiverPhone'),
    callOnArrival: readBoolean(value, 'callOnArrival'),
    leaveWithSecurity: readBoolean(value, 'leaveWithSecurity'),
    dontRingBell: readBoolean(value, 'dontRingBell'),
    liftNotWorking: readBoolean(value, 'liftNotWorking'),
    riderNote: readNullableString(value, 'riderNote'),
    selected: readBoolean(value, 'selected'),
    createdAt: readString(value, 'createdAt'),
    updatedAt: readString(value, 'updatedAt'),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readLabel(value: unknown): AddressLabel {
  if (isAddressLabel(value)) return value;
  throw new Error(rejected);
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.length === 0) throw new Error(rejected);
  return value;
}

function readNullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (value === null) return null;
  if (typeof value !== 'string') throw new Error(rejected);
  return value;
}

function readNullableNumber(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(rejected);
  return value;
}

function readBoolean(record: Record<string, unknown>, key: string): boolean {
  const value = record[key];
  if (typeof value !== 'boolean') throw new Error(rejected);
  return value;
}
