import * as SecureStore from 'expo-secure-store';

import { createSessionStore } from './session-store';

export const secureSessionStore = createSessionStore({
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  deleteItem: (key) => SecureStore.deleteItemAsync(key),
});
