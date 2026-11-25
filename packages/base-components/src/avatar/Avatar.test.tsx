import { renderUi } from '../../test/render';
import { Avatar, avatarSize } from './Avatar';

describe('Avatar', () => {
  it('sizes small, medium, and large initials', () => {
    expect(avatarSize('sm')).toBe(32);
    expect(avatarSize('md')).toBe(40);
    expect(avatarSize('lg')).toBe(56);
    const view = renderUi(
      <>
        <Avatar initials="AM" size="sm" />
        <Avatar initials="BM" />
        <Avatar initials="CM" size="lg" />
      </>,
    );
    expect(view.getByLabelText('BM')).toBeTruthy();
  });
});
