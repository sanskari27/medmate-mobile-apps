import { renderUi } from '../../test/render';
import { CheckLine } from './CheckLine';

describe('CheckLine', () => {
  it('renders checked and unchecked lines', () => {
    const view = renderUi(
      <>
        <CheckLine label="Opened" checked={false} />
        <CheckLine label="Done" checked />
      </>,
    );
    expect(view.getByLabelText('Opened')).toBeTruthy();
    expect(view.getByLabelText('Done')).toBeTruthy();
  });
});
