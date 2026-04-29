import { MMKV } from 'react-native-mmkv';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

// Constants
const MMKV_ID = process.env.EXPO_PUBLIC_MMKV_ID ?? process.env.MMKV_ID ?? 'powerlists-storage';
const MMKV_ENCRYPTION_KEY =
  process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY ?? process.env.MMKV_ENCRYPTION_KEY;

// Storage instance
const mmkvConfig: ConstructorParameters<typeof MMKV>[0] = {
  id: MMKV_ID,
};

if (MMKV_ENCRYPTION_KEY) {
  mmkvConfig.encryptionKey = MMKV_ENCRYPTION_KEY;
}

export const storage = new MMKV(mmkvConfig);

/**
 * Clears all data from MMKV storage
 * Use with caution - this will delete ALL persisted data
 */
export const clearAllStorage = (): void => {
  storage.clearAll();
  console.info('[Storage] All data cleared successfully');
};

/**
 * Gets all keys currently stored in MMKV
 */
export const getAllStorageKeys = (): string[] => {
  return storage.getAllKeys();
};

/**
 * Deletes specific keys from storage
 */
export const deleteStorageKeys = (keys: string[]): void => {
  for (const key of keys) {
    storage.delete(key);
  }
  console.info(`[Storage] Deleted ${keys.length} keys`);
};

/**
 * Debug utility - logs all stored keys and their values
 */
export const debugStorage = (): void => {
  const keys = storage.getAllKeys();
  console.info('[Storage] All stored keys:', keys);

  for (const key of keys) {
    const value = storage.getString(key);
    console.info(`[Storage] ${key}:`, value ? JSON.parse(value) : null);
  }
};

// Adapter for external storage consumers (expo-router, etc.)
export const mmkvStorage = {
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  getItem: (key: string): string | null => storage.getString(key) ?? null,
  removeItem: (key: string): void => {
    storage.delete(key);
  },
} as const;
