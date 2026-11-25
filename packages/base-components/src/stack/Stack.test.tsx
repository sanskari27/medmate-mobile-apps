import { Text } from '../text/Text';
import { renderUi } from '../../test/render';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders a row and a column', () => {
    const view = renderUi(
      <>
        <Stack direction="row" gap="sm">
          <Text>Row</Text>
        </Stack>
        <Stack>
          <Text>Column</Text>
        </Stack>
      </>,
    );
    expect(view.getByText('Row')).toBeTruthy();
    expect(view.getByText('Column')).toBeTruthy();
  });
});
