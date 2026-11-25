import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { ChoiceTile } from './ChoiceTile';

describe('ChoiceTile', () => {
  it('selects an enabled tile and skips a disabled one', () => {
    const onPress = jest.fn();
    const view = renderUi(
      <>
        <ChoiceTile label="Home" selected onPress={onPress} />
        <ChoiceTile label="Work" description="Weekdays" selected={false} onPress={onPress} />
        <ChoiceTile label="Other" selected={false} disabled onPress={onPress} />
      </>,
    );
    fireEvent.press(view.getByLabelText('Home'));
    fireEvent.press(view.getByLabelText('Other'));
    expect(view.getByText('Weekdays')).toBeTruthy();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
