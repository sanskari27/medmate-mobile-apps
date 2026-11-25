import { renderUi } from '../../test/render';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders a plain rule, a strong dashed rule, and labelled rules', () => {
    const view = renderUi(
      <>
        <Divider />
        <Divider strong dashed />
        <Divider label="Or" />
        <Divider label="More" dashed />
      </>,
    );
    expect(view.getByText('Or')).toBeTruthy();
    expect(view.getByText('More')).toBeTruthy();
  });
});
