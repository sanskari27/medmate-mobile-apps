import { Text } from '../text/Text';
import { renderUi } from '../../test/render';
import { Box } from './Box';

describe('Box', () => {
  it('renders children on a surface', () => {
    const view = renderUi(
      <Box>
        <Text>Inside</Text>
      </Box>,
    );
    expect(view.getByText('Inside')).toBeTruthy();
  });
});
