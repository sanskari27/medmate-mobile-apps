import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders a title and an optional action', () => {
    const onAction = jest.fn();
    const view = renderUi(
      <>
        <SectionHeader title="Offers" />
        <SectionHeader title="Care" actionLabel="See all" onAction={onAction} />
      </>,
    );
    fireEvent.press(view.getByLabelText('See all'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
