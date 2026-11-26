export type AddressLabel = 'home' | 'work' | 'other';

export function isAddressLabel(value: unknown): value is AddressLabel {
  return value === 'home' || value === 'work' || value === 'other';
}

export type AddressPin = {
  latitude: number;
  longitude: number;
};

export type Address = {
  id: string;
  label: AddressLabel;
  line1: string;
  line2: string;
  landmark: string | null;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
  receiverName: string;
  receiverPhone: string;
  callOnArrival: boolean;
  leaveWithSecurity: boolean;
  dontRingBell: boolean;
  liftNotWorking: boolean;
  riderNote: string | null;
  selected: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressInput = {
  label: AddressLabel;
  line1: string;
  line2: string;
  landmark: string | null;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
  receiverName: string;
  receiverPhone: string;
  callOnArrival: boolean;
  leaveWithSecurity: boolean;
  dontRingBell: boolean;
  liftNotWorking: boolean;
  riderNote: string | null;
  selected: boolean;
};
