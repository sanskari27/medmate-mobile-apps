import { semantic } from '@medmate/theme';

import { renderUi } from '../../test/render';
import { Text } from './Text';

describe('Text', () => {
  it('renders a variant with a class and a style override', () => {
    const view = renderUi(
      <Text
        variant="title3"
        color={semantic.text}
        className="text-semantic-text"
        style={{ fontSize: 20 }}
      >
        Hello
      </Text>,
    );
    expect(view.getByText('Hello')).toBeTruthy();
  });

  it('uses the body variant by default', () => {
    const view = renderUi(<Text>Column</Text>);
    expect(view.getByText('Column')).toBeTruthy();
  });
});
