import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { AddButton } from './AddButton';

describe('AddButton', () => {
  it('uses ADD by default and accepts a custom label', () => {
    const onPress = jest.fn();
    const view = renderUi(
      <>
        <AddButton onPress={onPress} />
        <AddButton label="Add item" disabled onPress={onPress} />
      </>,
    );
    fireEvent.press(view.getByLabelText('ADD'));
    fireEvent.press(view.getByLabelText('Add item'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
