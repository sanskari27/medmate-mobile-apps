import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl', () => {
  it('changes the selected option and ignores a disabled press', () => {
    const onChange = jest.fn();
    const view = renderUi(
      <>
        <SegmentedControl options={['All', 'Rx']} value="All" onChange={onChange} />
        <SegmentedControl options={['Open', 'Closed']} value="Open" disabled onChange={onChange} />
      </>,
    );
    fireEvent.press(view.getByLabelText('Rx'));
    fireEvent.press(view.getByLabelText('Open'));
    expect(onChange).toHaveBeenCalledWith('Rx');
  });
});
