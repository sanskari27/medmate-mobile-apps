import { radii } from '@medmate/theme';

import { renderUi } from '../../test/render';
import { ArtTile, artSize } from './ArtTile';

describe('ArtTile', () => {
  it('resolves size, initials, a photo, and an empty tile', () => {
    expect(artSize(12, 20, 8)).toEqual({ width: 12, height: 20 });
    expect(artSize(undefined, undefined, 8)).toEqual({ width: 8, height: 8 });
    expect(artSize(undefined, undefined, undefined)).toEqual({ width: 0, height: 0 });
    const view = renderUi(
      <>
        <ArtTile size={40} initials="AB" />
        <ArtTile width={20} height={30} photo={1} radius={radii.lg} />
        <ArtTile />
      </>,
    );
    expect(view.getByText('AB')).toBeTruthy();
  });
});
