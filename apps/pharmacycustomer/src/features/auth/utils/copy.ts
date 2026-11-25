export const loginHeading = 'Medicines from your';

export const loginHeadingAccent = 'neighbourhood pharmacy';

export const loginBody =
  'Log in or sign up with your mobile number. New here? The same code creates your account.';

export function codeNotice(phone: string): string {
  return `We'll send a 6-digit code to ${phone}.`;
}

export const otpHeadingLead = 'Enter the';

export const otpHeadingAccent = '6-digit code';

export const otpHeading = `${otpHeadingLead} ${otpHeadingAccent}`;

export function otpSubheading(phone: string): string {
  return `Sent by SMS to ${phone}`;
}

export const otpSafety =
  "MedMate will never call you to ask for this code. Don't share it with anyone.";

export const pinModeMessage = 'This number uses a PIN. Sign in from the pharmacy app.';
