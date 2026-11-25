import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders selected and idle classes', () => {
    const onPress = jest.fn();
    const view = renderUi(
      <>
        <Chip
          label="On"
          selected
          selectedClass="bg-mint-100"
          idleClass="bg-semantic-surface"
          onPress={onPress}
        />
        <Chip
          label="Off"
          selectedClass="bg-mint-100"
          idleClass="bg-semantic-surface"
          onPress={onPress}
        />
      </>,
    );
    fireEvent.press(view.getByLabelText('On'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
