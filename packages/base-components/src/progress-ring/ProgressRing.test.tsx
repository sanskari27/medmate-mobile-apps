import { renderUi } from '../../test/render';
import { ProgressRing, clampProgress } from './ProgressRing';

describe('ProgressRing', () => {
  it('clamps progress below 0, inside the range, and above 1', () => {
    expect(clampProgress(-1)).toBe(0);
    expect(clampProgress(0.4)).toBe(0.4);
    expect(clampProgress(2)).toBe(1);
    const view = renderUi(
      <>
        <ProgressRing progress={0.5} label="Week" />
        <ProgressRing progress={-1} label="Empty" />
        <ProgressRing progress={2} label="Full" />
      </>,
    );
    expect(view.getByLabelText('Week')).toBeTruthy();
    expect(view.getByText('0%')).toBeTruthy();
    expect(view.getByText('100%')).toBeTruthy();
  });
});
