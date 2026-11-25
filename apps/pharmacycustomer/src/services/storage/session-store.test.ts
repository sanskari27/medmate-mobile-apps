import { createMemorySessionStore, createSessionStore } from './session-store';
import { secureSessionStore } from './secure-session';
import { sessionFixture } from '../../../test/session-fixture';

describe('session store', () => {
  it('round-trips a session in memory', async () => {
    const store = createMemorySessionStore();
    expect(await store.read()).toBeNull();
    await store.write(sessionFixture());
    expect(await store.read()).toMatchObject({ accessToken: 'access' });
    await store.clear();
    expect(await store.read()).toBeNull();
  });

  it('drops a value that is not a session', async () => {
    const items = new Map<string, string>([['medmate.session', '{']]);
    const store = createSessionStore({
      getItem: async (key) => items.get(key) ?? null,
      setItem: async (key, value) => {
        items.set(key, value);
      },
      deleteItem: async (key) => {
        items.delete(key);
      },
    });
    expect(await store.read()).toBeNull();
    items.set('medmate.session', JSON.stringify({ accessToken: 1 }));
    expect(await store.read()).toBeNull();
  });

  it('uses the secure store', async () => {
    expect(await secureSessionStore.read()).toBeNull();
    await secureSessionStore.write(sessionFixture('secure-access'));
    expect(await secureSessionStore.read()).toMatchObject({ accessToken: 'secure-access' });
    await secureSessionStore.clear();
    expect(await secureSessionStore.read()).toBeNull();
  });
});
