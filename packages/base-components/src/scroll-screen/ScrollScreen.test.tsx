import { Text } from '../text/Text';
import { renderUi } from '../../test/render';
import { ScrollScreen } from './ScrollScreen';

describe('ScrollScreen', () => {
  it('renders scrolling page content', () => {
    const view = renderUi(
      <ScrollScreen>
        <Text>Scroll</Text>
      </ScrollScreen>,
    );
    expect(view.getByText('Scroll')).toBeTruthy();
  });
});
