import { render, screen } from '@testing-library/react-native';

import { MedicineFan } from './MedicineFan';

describe('MedicineFan', () => {
  it('shows the three medicine cards', () => {
    render(<MedicineFan />);
    expect(screen.getByLabelText('Medicine carton')).toBeTruthy();
    expect(screen.getByLabelText('Tablet pack')).toBeTruthy();
    expect(screen.getByLabelText('Cough syrup')).toBeTruthy();
  });
});
