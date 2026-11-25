import { formatNational, isIndianMobile, nationalDigits, otpDigits, toE164 } from './phone';

describe('phone', () => {
  it('keeps an Indian mobile and formats it', () => {
    expect(nationalDigits('98ab76543210999')).toBe('9876543210');
    expect(isIndianMobile('9876543210')).toBe(true);
    expect(isIndianMobile('5876543210')).toBe(false);
    expect(toE164('9876543210')).toBe('+919876543210');
    expect(formatNational('98765')).toBe('98765');
    expect(formatNational('9876543210')).toBe('98765 43210');
    expect(otpDigits('12ab345678')).toBe('123456');
    expect(
      otpDigits(
        '200928 is your MedMate login OTP, valid for 10 minutes. Never share this OTP with anyone, including MedMate staff. - MedMate India Technology Pvt Ltd',
      ),
    ).toBe('200928');
    expect(otpDigits('Ref 111111. 200928 is your MedMate login OTP, valid for 10 minutes.')).toBe(
      '200928',
    );
  });
});
