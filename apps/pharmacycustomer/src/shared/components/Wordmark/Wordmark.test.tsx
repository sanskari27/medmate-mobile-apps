import { render, screen } from '@testing-library/react-native';

import { Wordmark, splitMark } from './Wordmark';

describe('splitMark', () => {
  it('paints Mate in gold when the name starts with Med', () => {
    expect(splitMark('Medmate')).toEqual({ lead: 'Med', accent: 'Mate' });
    expect(splitMark('medmate')).toEqual({ lead: 'Med', accent: 'Mate' });
  });

  it('leaves other names whole', () => {
    expect(splitMark('Pharmacy')).toEqual({ lead: 'Pharmacy', accent: '' });
    expect(splitMark('Med')).toEqual({ lead: 'Med', accent: '' });
  });
});

describe('Wordmark', () => {
  it('centers the large lockup', () => {
    render(<Wordmark name="Medmate" size="large" />);
    expect(screen.getByRole('header')).toBeTruthy();
    expect(screen.getByText('Mate')).toBeTruthy();
    expect(screen.getByText('Care · delivered in minutes')).toBeTruthy();
  });

  it('keeps a short name in one colour', () => {
    render(<Wordmark name="Med" size="large" />);
    expect(screen.getByText('Med')).toBeTruthy();
    expect(screen.queryByText('Mate')).toBeNull();
  });

  it('uses the full name at small size', () => {
    render(<Wordmark name="Medmate" size="small" />);
    expect(screen.getByText('Medmate')).toBeTruthy();
    expect(screen.queryByText('Care · delivered in minutes')).toBeNull();
    expect(screen.queryByRole('header')).toBeNull();
  });
});
