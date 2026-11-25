import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { Button, buttonInk, type ButtonTone } from './Button';

const tones: ButtonTone[] = ['filled', 'forest', 'gold', 'outline', 'muted', 'mint'];

describe('Button', () => {
  it('picks ink for every tone', () => {
    expect(buttonInk('gold')).toBe(buttonInk('outline'));
    expect(buttonInk('mint')).toBe(buttonInk('gold'));
    expect(buttonInk('muted')).not.toBe(buttonInk('filled'));
    expect(buttonInk('forest')).toBe(buttonInk('filled'));
    expect(tones).toHaveLength(6);
  });

  it('renders every tone and handles press and disabled', () => {
    const onPress = jest.fn();
    const view = renderUi(
      <>
        {tones.map((tone) => (
          <Button key={tone} label={tone} tone={tone} onPress={onPress} />
        ))}
        <Button label="Buy" size="large" icon="plus" chevron onPress={onPress} />
        <Button label="Wait" disabled onPress={onPress} />
      </>,
    );

    fireEvent.press(view.getByLabelText('Buy'));
    fireEvent.press(view.getByLabelText('Wait'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
