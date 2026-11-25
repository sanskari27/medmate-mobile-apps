import { semantic } from '@medmate/theme';

import { renderUi } from '../../test/render';
import { Icon } from './Icon';
import { iconGlyphs, type IconName } from './iconPaths';

describe('Icon', () => {
  it('draws every glyph, including paths and circles', () => {
    expect(Object.keys(iconGlyphs).length).toBeGreaterThan(50);
    expect(iconGlyphs.camera.circles.length).toBeGreaterThan(0);
    expect(iconGlyphs.check.paths.length).toBeGreaterThan(0);
    renderUi(
      <>
        {(Object.keys(iconGlyphs) as IconName[]).map((name) => (
          <Icon key={name} name={name} color={semantic.text} />
        ))}
        <Icon name="check" size={16} strokeWidth={2} color={semantic.text} />
      </>,
    );
  });
});
