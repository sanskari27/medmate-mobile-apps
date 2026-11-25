import { renderUi } from '../../test/render';
import { Badge, type BadgeTone } from './Badge';

describe('Badge', () => {
  it('renders every tone', () => {
    const tones: BadgeTone[] = ['neutral', 'success', 'warning', 'danger'];
    const view = renderUi(
      <>
        {tones.map((tone) => (
          <Badge key={tone} label={tone} tone={tone} />
        ))}
        <Badge label="Default" />
      </>,
    );
    expect(view.getByText('danger')).toBeTruthy();
    expect(view.getByText('Default')).toBeTruthy();
  });
});
