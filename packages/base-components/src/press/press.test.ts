import { pressHandler } from './press';

describe('pressHandler', () => {
  it('drops presses while disabled', () => {
    const onPress = jest.fn();
    expect(pressHandler(true, onPress)).toBeUndefined();
    expect(pressHandler(false, onPress)).toBe(onPress);
    expect(pressHandler(false)).toBeUndefined();
  });
});
