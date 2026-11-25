/** Indian mobile numbers, the same rule as pharmacy-server `PhoneNumbers`. */
export function isIndianMobile(digits: string): boolean {
  return /^[6-9]\d{9}$/.test(digits);
}
