import { StyleSheet } from 'react-native';
import { elevation, mint, neutral, radii } from '@medmate/theme';

export const medicineFanStyles = StyleSheet.create({
  stage: {
    height: 188,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slot: {
    position: 'absolute',
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.xxl,
    borderWidth: 2,
    borderColor: mint[100],
    backgroundColor: neutral.surface,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  left: {
    width: 116,
    height: 144,
    transform: [{ translateX: -84 }, { rotate: '-14deg' }],
    ...elevation.medium,
  },
  right: {
    width: 116,
    height: 144,
    transform: [{ translateX: 84 }, { rotate: '12deg' }],
    ...elevation.medium,
  },
  center: {
    width: 132,
    height: 160,
    zIndex: 1,
    ...elevation.high,
  },
});
