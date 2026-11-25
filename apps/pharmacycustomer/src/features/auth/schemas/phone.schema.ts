import { isIndianMobile } from '../../../utils/phone';

export function phoneFieldError(digits: string): string | null {
  if (digits.length < 10) return null;
  if (!isIndianMobile(digits)) return 'Enter an Indian mobile number';
  return null;
}
