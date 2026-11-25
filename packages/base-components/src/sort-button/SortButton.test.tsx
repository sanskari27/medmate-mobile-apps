import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { SortButton } from './SortButton';

describe('SortButton', () => {
  it('presses the sort control', () => {
    const onPress = jest.fn();
    const view = renderUi(
      <>
        <SortButton onPress={onPress} />
        <SortButton disabled onPress={onPress} />
      </>,
    );
    fireEvent.press(view.getAllByLabelText('Sort')[0]);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
