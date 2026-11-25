import { fireEvent } from '@testing-library/react-native';

import { Text } from '../text/Text';
import { renderUi } from '../../test/render';
import { Modal } from './Modal';

describe('Modal', () => {
  it('hides when closed and closes when open', () => {
    const onClose = jest.fn();
    const view = renderUi(
      <>
        <Modal visible={false} title="Hidden" onClose={onClose} />
        <Modal visible title="Shown" onClose={onClose}>
          <Text>Body</Text>
        </Modal>
      </>,
    );
    fireEvent.press(view.getByLabelText('Close dialog'));
    expect(view.getByText('Shown')).toBeTruthy();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
