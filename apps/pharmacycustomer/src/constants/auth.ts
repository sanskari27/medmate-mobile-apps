/** Pharmacy server OTP codes are 6 digits (`Secrets.otpCode`). */
export const OTP_LENGTH = 6;

/** Login SMS says the code is valid for 10 minutes. */
export const OTP_TTL_SECONDS = 10 * 60;

/** Wait before another SMS can be requested. */
export const OTP_RESEND_SECONDS = 30;
