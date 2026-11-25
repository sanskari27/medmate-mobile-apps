import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('presses when enabled and ignores a disabled press', () => {
    const onPress = jest.fn();
    const view = renderUi(
      <>
        <IconButton icon="search" accessibilityLabel="Search products" onPress={onPress} />
        <IconButton icon="x" accessibilityLabel="Close" disabled onPress={onPress} />
      </>,
    );
    fireEvent.press(view.getByLabelText('Search products'));
    fireEvent.press(view.getByLabelText('Close'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
