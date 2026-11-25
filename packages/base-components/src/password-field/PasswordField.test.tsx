import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { PasswordField } from './PasswordField';

describe('PasswordField', () => {
  it('toggles between hidden and revealed', () => {
    const onToggle = jest.fn();
    const view = renderUi(
      <>
        <PasswordField label="Password" value="secret" onToggleReveal={onToggle} />
        <PasswordField label="Shown" value="secret" revealed onToggleReveal={onToggle} />
      </>,
    );
    fireEvent.press(view.getByLabelText('Show password'));
    fireEvent.press(view.getByLabelText('Hide password'));
    expect(onToggle).toHaveBeenCalledTimes(2);
  });
});
