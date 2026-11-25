import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('hides when closed and confirms or cancels when open', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const view = renderUi(
      <>
        <Dialog
          visible={false}
          title="Hidden dialog"
          message="No"
          confirmLabel="Yes hidden"
          cancelLabel="No hidden"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
        <Dialog
          visible
          title="Cancel order"
          message="This cannot be undone"
          confirmLabel="Confirm cancel"
          cancelLabel="Keep order"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </>,
    );
    fireEvent.press(view.getByLabelText('Confirm cancel'));
    fireEvent.press(view.getByLabelText('Keep order'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
