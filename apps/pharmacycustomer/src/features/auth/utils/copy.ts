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

export const termsHeadingLead = 'Terms and';

export const termsHeadingAccent = 'Conditions';

export const termsHeading = `${termsHeadingLead} ${termsHeadingAccent}`;

export const termsIntro =
  'Here is what you agree to when you use MedMate, in plain words. You can change these later in Account.';

export function termsSignedIn(phone: string): string {
  return `Signed in as ${phone}`;
}

export const termsIncludedLabel = 'Included in our terms';

export const healthTitle = 'Health information';

export const healthBody =
  'Prescriptions, medicines you order and your schedule. Used to fill your orders. Never for ads.';

export const healthMeaning =
  'The pharmacy uses this to pack the order you place. MedMate does not use it to advertise, and it is never sold.';

export const usageTitle = 'Usage and activity';

export const usageBody =
  'Screens opened, searches and crash reports. Used to fix and improve MedMate. Never sold.';

export const usageMeaning =
  'This shows which parts of MedMate are hard to use and where the app crashes, so those can be fixed. It is never sold.';

export const whatThisMeans = 'What this means';

export function whatThisMeansLabel(title: string): string {
  return `${whatThisMeans}, ${title}`;
}

export const orderUpdates =
  'Order updates. Order confirmed, packed, on the way, delivered. These come either way.';

export const contactShare =
  'Your number and address. Shared with the pharmacy and rider only for an order you place.';

export const ageLabel = 'I am 18 years or older';

export const ageHint = 'Required';

export const offersLabel = 'Send me offers and refill reminders';

export const offersHint = 'Optional · off unless you tick it. Order updates come either way.';

export const termsConsentLead = 'By tapping Agree and continue you accept our ';

export const termsLink = 'Terms and Conditions';

export const termsConsentMiddle =
  ', including the use of your health information and usage data described there, and confirm you have read our ';

export const privacyLink = 'Privacy Policy';

export const termsAgree = 'Agree and continue';

export const termsDecline = "I don't agree, log me out";

export const termsVersion = 'Version 1 October 2026';
