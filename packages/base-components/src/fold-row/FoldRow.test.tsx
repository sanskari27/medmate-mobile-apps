import { fireEvent } from '@testing-library/react-native';

import { Text } from '../text/Text';
import { renderUi } from '../../test/render';
import { FoldRow } from './FoldRow';

describe('FoldRow', () => {
  it('shows children only while expanded', () => {
    const onToggle = jest.fn();
    const view = renderUi(
      <>
        <FoldRow title="Details" expanded={false} onToggle={onToggle}>
          <Text>Hidden</Text>
        </FoldRow>
        <FoldRow title="Bill" expanded onToggle={onToggle}>
          <Text>Line</Text>
        </FoldRow>
      </>,
    );
    fireEvent.press(view.getByLabelText('Details'));
    expect(view.getByText('Line')).toBeTruthy();
    expect(view.queryByText('Hidden')).toBeNull();
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
