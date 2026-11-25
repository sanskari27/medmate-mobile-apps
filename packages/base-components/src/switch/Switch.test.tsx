import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { Switch } from './Switch';

describe('Switch', () => {
  it('changes value when enabled', () => {
    const onValueChange = jest.fn();
    const view = renderUi(
      <>
        <Switch label="Alerts" value={false} onValueChange={onValueChange} />
        <Switch label="Alerts on" value disabled onValueChange={onValueChange} />
      </>,
    );
    fireEvent.press(view.getByLabelText('Alerts'));
    fireEvent.press(view.getByLabelText('Alerts on'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});
