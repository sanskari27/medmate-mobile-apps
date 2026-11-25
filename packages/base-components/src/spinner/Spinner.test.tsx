import { renderUi } from '../../test/render';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders the default and large sizes', () => {
    const view = renderUi(
      <>
        <Spinner />
        <Spinner size="large" label="Please wait" />
      </>,
    );
    expect(view.getByLabelText('Loading')).toBeTruthy();
    expect(view.getByLabelText('Please wait')).toBeTruthy();
  });
});
