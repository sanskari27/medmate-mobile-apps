import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders a message and an optional action', () => {
    const onAction = jest.fn();
    const view = renderUi(
      <>
        <EmptyState title="None" message="Try another word" />
        <EmptyState title="None" message="Try again" actionLabel="Retry" onAction={onAction} />
      </>,
    );
    fireEvent.press(view.getByLabelText('Retry'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
