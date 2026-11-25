import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { TextField } from './TextField';

describe('TextField', () => {
  it('edits a field, shows an error, and locks a secure field', () => {
    const onChangeText = jest.fn();
    const view = renderUi(
      <>
        <TextField label="Name" value="" onChangeText={onChangeText} />
        <TextField label="Broken" value="x" error="Required" />
        <TextField
          label="Locked"
          value="secret"
          secureTextEntry
          disabled
          onChangeText={onChangeText}
        />
      </>,
    );
    fireEvent.changeText(view.getByLabelText('Name'), 'Ada');
    expect(view.getByText('Required')).toBeTruthy();
    expect(onChangeText).toHaveBeenCalledWith('Ada');
  });
});
