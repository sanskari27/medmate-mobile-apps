import {
  formatNational,
  formatSignedInPhone,
  isIndianMobile,
  nationalDigits,
  otpDigits,
  storedNationalDigits,
  toE164,
} from './phone';

describe('phone', () => {
  it('keeps an Indian mobile and formats it', () => {
    expect(nationalDigits('98ab76543210999')).toBe('9876543210');
    expect(storedNationalDigits('+91 98450 12345')).toBe('9845012345');
    expect(storedNationalDigits('98450')).toBe('98450');
    expect(storedNationalDigits('')).toBe('');
    expect(isIndianMobile('9876543210')).toBe(true);
    expect(isIndianMobile('5876543210')).toBe(false);
    expect(toE164('9876543210')).toBe('+919876543210');
    expect(formatNational('98765')).toBe('98765');
    expect(formatNational('9876543210')).toBe('98765 43210');
    expect(formatSignedInPhone('+919876543210')).toBe('+91 98765 43210');
    expect(formatSignedInPhone('98765')).toBe('+91 98765');
    expect(formatSignedInPhone('')).toBe('');
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
