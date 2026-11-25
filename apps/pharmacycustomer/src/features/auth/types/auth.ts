export type OtpMode = 'otp' | 'pin';

export function isOtpMode(value: unknown): value is OtpMode {
  return value === 'otp' || value === 'pin';
}
