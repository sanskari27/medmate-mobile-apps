import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { OutlinePillButton } from './OutlinePillButton';

describe('OutlinePillButton', () => {
  it('renders with and without an icon', () => {
    const onPress = jest.fn();
    const view = renderUi(
      <>
        <OutlinePillButton label="Filter" onPress={onPress} />
        <OutlinePillButton label="With icon" icon="check" disabled onPress={onPress} />
      </>,
    );
    fireEvent.press(view.getByLabelText('Filter'));
    fireEvent.press(view.getByLabelText('With icon'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
