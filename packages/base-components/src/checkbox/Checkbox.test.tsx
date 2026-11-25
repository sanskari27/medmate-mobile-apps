import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles when enabled and ignores a disabled press', () => {
    const onChange = jest.fn();
    const view = renderUi(
      <>
        <Checkbox label="Consent" checked={false} onChange={onChange} />
        <Checkbox label="Accepted" checked disabled onChange={onChange} />
      </>,
    );
    fireEvent.press(view.getByLabelText('Consent'));
    fireEvent.press(view.getByLabelText('Accepted'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
