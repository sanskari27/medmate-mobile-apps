import { renderUi } from '../../test/render';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders info, warning, and danger tones', () => {
    const view = renderUi(
      <>
        <Banner title="Info" message="Ships today" />
        <Banner title="Warn" message="Low stock" tone="warning" />
        <Banner title="Stop" message="Unavailable" tone="danger" />
      </>,
    );
    expect(view.getByText('Ships today')).toBeTruthy();
    expect(view.getByText('Low stock')).toBeTruthy();
    expect(view.getByText('Unavailable')).toBeTruthy();
  });
});
