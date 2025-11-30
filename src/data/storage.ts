import { createMMKV } from 'react-native-mmkv';

const MMKV_ID = process.env.MMKV_ID;
const MMKV_ENCRYPTION_KEY = process.env.MMKV_ENCRYPTION_KEY;

export const storage = createMMKV({
  id: MMKV_ID,
  encryptionKey: MMKV_ENCRYPTION_KEY,
});

export const mmkvStorage = {
  setItem: (key: string, value: string) => storage.set(key, value),
  getItem: (key: string) => storage.getString(key) ?? null,
  removeItem: (key: string) => storage.remove(key),
};
