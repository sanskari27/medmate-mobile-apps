export const deliveryWindow = '15 - 40';
export const deliveryUnit = 'mins';
export const searchLabel = 'Search for products';
export const profileLabel = 'Profile';
export const chooseAddress = 'Choose address';
export const pharmaciesTitle = 'Pharmacies near you';
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
  return `${km} km`;
}

export function onlineOrdersLabel(accepts: boolean): string {
  return accepts ? 'Accepts online orders' : 'In-store only';
}
