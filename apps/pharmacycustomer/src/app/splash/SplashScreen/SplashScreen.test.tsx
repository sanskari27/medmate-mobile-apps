import { act, render, screen } from '@testing-library/react-native';

import { SplashScreen, splashFadeMs, splashMark } from './SplashScreen';

describe('splashMark', () => {
  it('paints Mate in gold when the name starts with Med', () => {
    expect(splashMark('Medmate')).toEqual({ lead: 'Med', accent: 'Mate' });
    expect(splashMark('medmate')).toEqual({ lead: 'Med', accent: 'Mate' });
  });

  it('leaves other names whole', () => {
    expect(splashMark('Pharmacy')).toEqual({ lead: 'Pharmacy', accent: '' });
    expect(splashMark('Med')).toEqual({ lead: 'Med', accent: '' });
  });
});

describe('SplashScreen', () => {
  it('shows the brand lockup', () => {
    render(<SplashScreen />);
    expect(screen.getByRole('header')).toBeTruthy();
    expect(screen.getByText('MedMate')).toBeTruthy();
    expect(screen.getByText('Mate')).toBeTruthy();
    expect(screen.getByText('Care · delivered in minutes')).toBeTruthy();
    expect(screen.getByText('Made in Bengaluru')).toBeTruthy();
  });

  it('fades out and reports when the fade finishes', () => {
    jest.useFakeTimers();
    try {
      const onFaded = jest.fn();
      render(<SplashScreen fading onFaded={onFaded} />);
      expect(onFaded).not.toHaveBeenCalled();
      expect(screen.getByText('Made in Bengaluru')).toBeTruthy();

      act(() => {
        jest.advanceTimersByTime(splashFadeMs);
      });
      expect(onFaded).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it('finishes a fade that nobody is listening for', () => {
    jest.useFakeTimers();
    try {
      render(<SplashScreen fading />);
      act(() => {
        jest.advanceTimersByTime(splashFadeMs);
      });
      expect(screen.getByText('Made in Bengaluru')).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });

  it('does not report a fade that is stopped', () => {
    jest.useFakeTimers();
    try {
      const onFaded = jest.fn();
      const view = render(<SplashScreen fading onFaded={onFaded} />);
      view.unmount();
      act(() => {
        jest.advanceTimersByTime(splashFadeMs);
      });
      expect(onFaded).not.toHaveBeenCalled();
    } finally {
      jest.useRealTimers();
    }
  });

  it('keeps a name that does not start with Med in one colour', () => {
    render(<SplashScreen name="Pharmacy" />);
    expect(screen.getByText('Pharmacy')).toBeTruthy();
    expect(screen.queryByText('Mate')).toBeNull();
    expect(screen.getByText('Made in Bengaluru')).toBeTruthy();
  });
});
