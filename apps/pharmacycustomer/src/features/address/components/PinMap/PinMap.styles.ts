import { StyleSheet } from 'react-native';
import { neutral } from '@medmate/theme';

export const pinMapStyles = StyleSheet.create({
  frame: {
    height: 400,
    overflow: 'hidden',
    backgroundColor: neutral.surface,
    borderBottomWidth: 1,
    borderBottomColor: neutral.line,
  },
  map: { flex: 1 },
  pin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -24,
  },
});
