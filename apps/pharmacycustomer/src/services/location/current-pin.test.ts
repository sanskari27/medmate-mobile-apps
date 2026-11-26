import * as Location from 'expo-location';

import { readCurrentPin } from './current-pin';

const permission = jest.mocked(Location.requestForegroundPermissionsAsync);
const position = jest.mocked(Location.getCurrentPositionAsync);

describe('readCurrentPin', () => {
  it('returns null when location is unavailable and the coordinates when it is not', async () => {
    permission.mockResolvedValueOnce({ status: 'denied' } as Awaited<
      ReturnType<typeof Location.requestForegroundPermissionsAsync>
    >);
    await expect(readCurrentPin()).resolves.toBeNull();

    permission.mockResolvedValueOnce({ status: 'granted' } as Awaited<
      ReturnType<typeof Location.requestForegroundPermissionsAsync>
    >);
    position.mockResolvedValueOnce({
      coords: { latitude: Number.NaN, longitude: 77 },
    } as Awaited<ReturnType<typeof Location.getCurrentPositionAsync>>);
    await expect(readCurrentPin()).resolves.toBeNull();

    permission.mockResolvedValueOnce({ status: 'granted' } as Awaited<
      ReturnType<typeof Location.requestForegroundPermissionsAsync>
    >);
    position.mockResolvedValueOnce({
      coords: { latitude: 12.93, longitude: Number.POSITIVE_INFINITY },
    } as Awaited<ReturnType<typeof Location.getCurrentPositionAsync>>);
    await expect(readCurrentPin()).resolves.toBeNull();

    permission.mockResolvedValueOnce({ status: 'granted' } as Awaited<
      ReturnType<typeof Location.requestForegroundPermissionsAsync>
    >);
    position.mockResolvedValueOnce({
      coords: { latitude: 12.93, longitude: 77.58 },
    } as Awaited<ReturnType<typeof Location.getCurrentPositionAsync>>);
    await expect(readCurrentPin()).resolves.toEqual({ latitude: 12.93, longitude: 77.58 });

    permission.mockRejectedValueOnce(new Error('unavailable'));
    await expect(readCurrentPin()).resolves.toBeNull();
  });
});
