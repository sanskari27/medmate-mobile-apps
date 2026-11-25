import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('selects an enabled option and skips disabled ones', () => {
    const onChange = jest.fn();
    const view = renderUi(
      <>
        <RadioGroup
          label="Slot"
          value="am"
          onChange={onChange}
          options={[
            { label: 'Morning', value: 'am' },
            { label: 'Evening', value: 'pm', disabled: true },
          ]}
        />
        <RadioGroup
          label="Locked slot"
          value="am"
          disabled
          onChange={onChange}
          options={[{ label: 'Morning locked', value: 'am' }]}
        />
      </>,
    );
    fireEvent.press(view.getByLabelText('Evening'));
    fireEvent.press(view.getByLabelText('Morning locked'));
    fireEvent.press(view.getByLabelText('Morning'));
    expect(onChange).toHaveBeenCalledWith('am');
  });
});
