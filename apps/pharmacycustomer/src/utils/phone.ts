import { OTP_LENGTH } from '../constants/auth';
import { isIndianMobile } from '../shared/validators/indian-mobile';

export { isIndianMobile };

export function nationalDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

export function toE164(digits: string): string {
  return `+91${digits}`;
}

export function formatNational(digits: string): string {
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/** MedMate login SMS: "200928 is your MedMate login OTP, valid for 10 minutes. …" */
const loginOtpMessage = /(\d{6}) is your MedMate login OTP\b/;

export function otpDigits(value: string): string {
  const fromSms = value.match(loginOtpMessage)?.[1];
  return (fromSms ?? value.replace(/\D/g, '')).slice(0, OTP_LENGTH);
}
