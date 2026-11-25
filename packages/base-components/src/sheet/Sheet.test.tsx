import { fireEvent } from '@testing-library/react-native';

import { Text } from '../text/Text';
import { renderUi } from '../../test/render';
import { Sheet } from './Sheet';

describe('Sheet', () => {
  it('hides when closed and dismisses when open', () => {
    const onClose = jest.fn();
    const view = renderUi(
      <>
        <Sheet visible={false} title="Hidden sheet" onClose={onClose} />
        <Sheet visible title="Sort by" onClose={onClose}>
          <Text>Price</Text>
        </Sheet>
      </>,
    );
    fireEvent.press(view.getByLabelText('Dismiss sheet'));
    expect(view.getByText('Price')).toBeTruthy();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
