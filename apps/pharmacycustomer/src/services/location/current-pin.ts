import * as Location from 'expo-location';

export type CurrentPin = {
  latitude: number;
  longitude: number;
};

export async function readCurrentPin(): Promise<CurrentPin | null> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') return null;
    const position = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = position.coords;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return { latitude, longitude };
  } catch {
    return null;
  }
}
