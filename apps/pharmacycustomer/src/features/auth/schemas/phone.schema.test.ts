import { phoneFieldError } from './phone.schema';

describe('phoneFieldError', () => {
  it('waits for 10 digits, then checks the Indian prefix', () => {
    expect(phoneFieldError('98765')).toBeNull();
    expect(phoneFieldError('5876543210')).toBe('Enter an Indian mobile number');
    expect(phoneFieldError('9876543210')).toBeNull();
  });
});
