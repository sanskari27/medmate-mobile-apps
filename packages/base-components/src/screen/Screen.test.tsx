import { Text } from '../text/Text';
import { renderUi } from '../../test/render';
import { Screen } from './Screen';

describe('Screen', () => {
  it('renders page content inside the safe area', () => {
    const view = renderUi(
      <Screen>
        <Text>Home</Text>
      </Screen>,
    );
    expect(view.getByText('Home')).toBeTruthy();
  });
});
