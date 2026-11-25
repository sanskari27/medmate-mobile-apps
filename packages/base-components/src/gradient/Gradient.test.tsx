import { Text } from '../text/Text';
import { renderUi } from '../../test/render';
import { Gradient, gradientStops, stopOffset } from './Gradient';

describe('Gradient', () => {
  it('renders token and custom stops', () => {
    expect(gradientStops('brand', ['#FFFFFF'])).toEqual(['#FFFFFF']);
    expect(gradientStops('art', undefined)).toHaveLength(2);
    expect(stopOffset(0, 1)).toBe(0);
    expect(stopOffset(1, 2)).toBe(1);
    const view = renderUi(
      <>
        <Gradient>
          <Text>Art</Text>
        </Gradient>
        <Gradient token="brand" colors={['#FFFFFF']} radius={8} />
      </>,
    );
    expect(view.getByText('Art')).toBeTruthy();
  });
});
