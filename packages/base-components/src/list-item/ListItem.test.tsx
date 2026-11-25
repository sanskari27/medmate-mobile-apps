import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { ListItem } from './ListItem';

describe('ListItem', () => {
  it('renders a plain row, a detailed row, and a disabled row', () => {
    const onPress = jest.fn();
    const view = renderUi(
      <>
        <ListItem title="Profile" onPress={onPress} />
        <ListItem title="Orders" subtitle="2 active" icon="bag" chevron onPress={onPress} />
        <ListItem title="Locked row" disabled onPress={onPress} />
      </>,
    );
    fireEvent.press(view.getByLabelText('Profile'));
    fireEvent.press(view.getByLabelText('Locked row'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
