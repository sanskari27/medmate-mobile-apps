import { Text } from '../text/Text';
import { renderUi } from '../../test/render';
import { Card } from './Card';

describe('Card', () => {
  it('renders elevated surface content', () => {
    const view = renderUi(
      <Card>
        <Text>Card</Text>
      </Card>,
    );
    expect(view.getByText('Card')).toBeTruthy();
  });
});
