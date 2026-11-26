import type { AddressLabel } from '../types/address';

export const addressHeadingLead = 'Where should we deliver';
export const addressHeadingAccent = 'your order?';
export const addressPartners = '6 partner pharmacies open now · fastest in 32–47 min';
export const addressFormHint =
  'Add a landmark and a number the rider can call, so they find you first time.';
export const useLocationTitle = 'Use my current location';
export const useLocationBody = 'Pins the exact spot for the rider. Only while the app is open.';
export const detectLabel = 'Detect';
export const pinSaved = 'Pinned';
export const pinDenied = 'Location is off. Type the address and the rider can still find you.';
export const savedAddressesLabel = (count: number) => `Saved addresses · ${count}`;
export const deliveringHere = 'Delivering here';
export const addAddressLabel = 'Add new address';
export const serviceNote =
  'We deliver across Bengaluru (pincodes starting 560) from licensed partner pharmacies nearby.';
export const deliverTo = (label: string) => `Deliver to ${label}`;
export const deliverPrompt = 'Deliver here';
export const addressBack = 'Back';
export const addAddressTitle = 'Add address';
export const editAddressTitle = 'Edit address';
export const locationFormBody =
  'Without a pin, the rider finds you from the address you type and may call the number below.';
export const addressDetails = 'Address details';
export const saveAs = 'Save as';
export const labelHome = 'Home';
export const labelWork = 'Work';
export const labelOther = 'Other';
export const line1Label = 'Flat, house or building';
export const line2Label = 'Area and street';
export const landmarkLabel = 'Landmark (optional)';
export const cityLabel = 'City';
export const pincodeLabel = 'Pincode';
export const weDeliverHere = 'We deliver here';
export const outsideArea = 'We deliver across Bengaluru (pincodes starting 560)';
export const receiverHeading = 'Who receives it?';
export const receiverNameLabel = 'Name';
export const receiverPhoneLabel = 'Mobile number';
export const receiverPhoneHint = 'The rider calls this number if they cannot find you';
export const useMyNumber = 'Use my number';
export const instructionsHeading = 'Instructions for the rider';
export const instructionsOptional = 'Optional. Shown to the rider for deliveries to this address.';
export const callOnArrivalLabel = 'Call when you arrive';
export const leaveWithSecurityLabel = 'Leave with security';
export const dontRingBellLabel = "Don't ring the bell";
export const liftNotWorkingLabel = 'Lift is not working';
export const noteLabel = 'Your instructions';
export const notePlaceholder = 'For example gate 2, third floor, ring twice';
export const deliverNowLabel = 'Deliver here now';
export const deliverNowHint = 'Use this as your delivery address for the next order.';
export const saveAndDeliver = 'Save and deliver here';
export const addressLoading = 'Finding your addresses';
export const tryAgain = 'Try again';
export const line1Required = 'Flat, house or building is required';
export const line2Required = 'Area and street is required';
export const cityRequired = 'City is required';
export const nameRequired = 'Name is required';
export const phoneInvalid = 'Enter an Indian mobile number';

export const NOTE_MAX = 140;

const labelCopy: Record<AddressLabel, string> = {
  home: labelHome,
  work: labelWork,
  other: labelOther,
};

export function addressLabel(label: AddressLabel): string {
  return labelCopy[label];
}
