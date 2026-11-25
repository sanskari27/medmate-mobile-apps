import { parseOtpMode } from './session.schema';

describe('parseOtpMode', () => {
  it('accepts otp and pin', () => {
    expect(parseOtpMode({ mode: 'otp' })).toBe('otp');
    expect(parseOtpMode({ mode: 'pin' })).toBe('pin');
  });

  it('rejects anything else', () => {
    expect(() => parseOtpMode(null)).toThrow('Code could not be sent');
    expect(() => parseOtpMode({ mode: 'email' })).toThrow('Code could not be sent');
    expect(() => parseOtpMode({ mode: 1 })).toThrow('Code could not be sent');
  });
});
