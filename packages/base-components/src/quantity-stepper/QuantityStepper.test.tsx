import { fireEvent } from '@testing-library/react-native';

import { renderUi } from '../../test/render';
import { QuantityStepper, stepQuantity } from './QuantityStepper';

describe('QuantityStepper', () => {
  it('clamps steps and disables the ends', () => {
    expect(stepQuantity(1, -1, 1, 99)).toBe(1);
    expect(stepQuantity(99, 1, 1, 99)).toBe(99);
    expect(stepQuantity(2, 1, 1, 99)).toBe(3);
    const onChange = jest.fn();
    const view = renderUi(
      <>
        <QuantityStepper value={2} onChange={onChange} />
        <QuantityStepper value={1} onChange={onChange} />
        <QuantityStepper value={99} onChange={onChange} />
        <QuantityStepper value={4} min={1} max={99} disabled onChange={onChange} />
      </>,
    );
    fireEvent.press(view.getAllByLabelText('Increase quantity')[0]);
    fireEvent.press(view.getAllByLabelText('Decrease quantity')[0]);
    fireEvent.press(view.getAllByLabelText('Decrease quantity')[1]);
    fireEvent.press(view.getAllByLabelText('Increase quantity')[2]);
    fireEvent.press(view.getAllByLabelText('Increase quantity')[3]);
    expect(onChange).toHaveBeenCalledWith(3);
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
