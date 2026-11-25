import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { OtpInput, sanitizeOtp } from './OtpInput';

describe('OtpInput', () => {
  it('keeps only digits up to the length', () => {
    expect(sanitizeOtp('12a34', 4)).toBe('1234');
    expect(sanitizeOtp('123456789', 6)).toBe('123456');
    const onChange = jest.fn();
    const view = renderUi(
      <>
        <OtpInput value="" onChange={onChange} />
        <OtpInput value="1" length={4} disabled onChange={onChange} />
      </>,
    );
    fireEvent.changeText(view.getAllByLabelText('One time code')[0], '12a34');
    expect(onChange).toHaveBeenCalledWith('1234');
  });
});
