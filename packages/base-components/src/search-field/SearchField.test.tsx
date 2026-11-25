import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { SearchField } from './SearchField';

describe('SearchField', () => {
  it('edits the query and clears a non-empty value', () => {
    const onChangeText = jest.fn();
    const onClear = jest.fn();
    const view = renderUi(
      <>
        <SearchField value="" onChangeText={onChangeText} onClear={onClear} />
        <SearchField
          value="aspirin"
          placeholder="Find a medicine"
          onChangeText={onChangeText}
          onClear={onClear}
        />
      </>,
    );
    fireEvent.changeText(view.getAllByLabelText('Search')[1], 'para');
    fireEvent.press(view.getByLabelText('Clear search'));
    expect(onChangeText).toHaveBeenCalledWith('para');
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
