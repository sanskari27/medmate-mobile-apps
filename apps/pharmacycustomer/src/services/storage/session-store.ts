import { parseSession } from './parse-session';
import type { Session } from '../../types/session';

const SESSION_KEY = 'medmate.session';

export type KeyValue = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
};

export type SessionStore = {
  read: () => Promise<Session | null>;
  write: (session: Session) => Promise<void>;
  clear: () => Promise<void>;
};

export function createSessionStore(kv: KeyValue): SessionStore {
  return {
    async read() {
      const raw = await kv.getItem(SESSION_KEY);
      if (!raw) return null;
      try {
        return parseSession(JSON.parse(raw) as unknown);
      } catch {
        return null;
      }
    },
    async write(session) {
      await kv.setItem(SESSION_KEY, JSON.stringify(session));
    },
    async clear() {
      await kv.deleteItem(SESSION_KEY);
    },
  };
}

export function createMemoryKeyValue(): KeyValue {
  const items = new Map<string, string>();
  return {
    async getItem(key) {
      return items.get(key) ?? null;
    },
    async setItem(key, value) {
      items.set(key, value);
    },
    async deleteItem(key) {
      items.delete(key);
    },
  };
}

export function createMemorySessionStore(): SessionStore {
  return createSessionStore(createMemoryKeyValue());
}
