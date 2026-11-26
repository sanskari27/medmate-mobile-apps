import { isIndianMobile, nationalDigits, storedNationalDigits } from '../../../utils/phone';
import type { Address, AddressInput, AddressLabel, AddressPin } from '../types/address';
import {
  cityRequired,
  line1Required,
  line2Required,
  nameRequired,
  outsideArea,
  phoneInvalid,
} from './copy';

export type AddressDraft = {
  label: AddressLabel;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  pincode: string;
  receiverName: string;
  receiverPhone: string;
  callOnArrival: boolean;
  leaveWithSecurity: boolean;
  dontRingBell: boolean;
  liftNotWorking: boolean;
  riderNote: string;
  deliverNow: boolean;
  pin: AddressPin | null;
};

export type AddressField = 'line1' | 'line2' | 'city' | 'pincode' | 'receiverName' | 'receiverPhone';

export function deliversHere(pincode: string): boolean {
  return /^560\d{3}$/.test(pincode.replace(/\s/g, ''));
}

export function emptyDraft(address: Address | null, pin: AddressPin | null): AddressDraft {
  return {
    label: address?.label ?? 'home',
    line1: address?.line1 ?? '',
    line2: address?.line2 ?? '',
    landmark: address?.landmark ?? '',
    city: address?.city ?? 'Bengaluru',
    pincode: address?.pincode ?? '',
    receiverName: address?.receiverName ?? '',
    receiverPhone: address ? storedNationalDigits(address.receiverPhone) : '',
    callOnArrival: address ? address.callOnArrival : true,
    leaveWithSecurity: address ? address.leaveWithSecurity : false,
    dontRingBell: address ? address.dontRingBell : false,
    liftNotWorking: address ? address.liftNotWorking : false,
    riderNote: address?.riderNote ?? '',
    deliverNow: address ? address.selected : true,
    pin: startingPin(address, pin),
  };
}

export function startingPin(address: Address | null, pin: AddressPin | null): AddressPin | null {
  if (address?.latitude != null && address.longitude != null) {
    return { latitude: address.latitude, longitude: address.longitude };
  }
  return pin;
}

export function validateAddress(draft: AddressDraft): Partial<Record<AddressField, string>> {
  const errors: Partial<Record<AddressField, string>> = {};
  if (!draft.line1.trim()) errors.line1 = line1Required;
  if (!draft.line2.trim()) errors.line2 = line2Required;
  if (!draft.city.trim()) errors.city = cityRequired;
  if (!deliversHere(draft.pincode)) errors.pincode = outsideArea;
  if (!draft.receiverName.trim()) errors.receiverName = nameRequired;
  if (!isIndianMobile(nationalDigits(draft.receiverPhone))) errors.receiverPhone = phoneInvalid;
  return errors;
}

export function toAddressInput(draft: AddressDraft): AddressInput {
  const landmark = draft.landmark.trim();
  const riderNote = draft.riderNote.trim();
  return {
    label: draft.label,
    line1: draft.line1.trim(),
    line2: draft.line2.trim(),
    landmark: landmark ? landmark : null,
    city: draft.city.trim(),
    pincode: draft.pincode.replace(/\s/g, ''),
    latitude: draft.pin?.latitude ?? null,
    longitude: draft.pin?.longitude ?? null,
    receiverName: draft.receiverName.trim(),
    receiverPhone: `+91${nationalDigits(draft.receiverPhone)}`,
    callOnArrival: draft.callOnArrival,
    leaveWithSecurity: draft.leaveWithSecurity,
    dontRingBell: draft.dontRingBell,
    liftNotWorking: draft.liftNotWorking,
    riderNote: riderNote ? riderNote : null,
    selected: draft.deliverNow,
  };
}
