import { ObservablePersistPlugin, PersistMetadata, PersistOptions } from '@legendapp/state/sync';
import { MMKV } from 'react-native-mmkv';

// Types
interface Change {
  path: readonly (string | number)[];
  valueAtPath: unknown;
  prevAtPath: unknown;
}

type StorageKey = string;
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

// Constants
const MMKV_ID = process.env.EXPO_PUBLIC_MMKV_ID ?? process.env.MMKV_ID ?? 'powerlists-storage';
const MMKV_ENCRYPTION_KEY =
  process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY ?? process.env.MMKV_ENCRYPTION_KEY;
const METADATA_SUFFIX = '__metadata';

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

// Helper functions
const buildKey = (table: string, config: PersistOptions): StorageKey => config.name || table;

const buildMetadataKey = (table: string, config: PersistOptions): StorageKey =>
  `${buildKey(table, config)}${METADATA_SUFFIX}`;

const safeJsonParse = <T>(value: string | undefined, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    console.warn('[Storage] Failed to parse JSON, returning fallback');
    return fallback;
  }
};

const safeJsonStringify = (data: unknown): string | null => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('[Storage] Failed to stringify data:', error);
    return null;
  }
};

/**
 * Applies a value to a nested path within an object
 * Creates intermediate objects as needed
 */
const setValueAtPath = (
  obj: Record<string, unknown>,
  path: readonly (string | number)[],
  value: unknown,
): Record<string, unknown> => {
  // Replace entire object if path is empty
  if (path.length === 0) {
    return value as Record<string, unknown>;
  }

  let current: Record<string, unknown> = obj;

  // Navigate to the parent of the target, creating objects as needed
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (current[key] === undefined || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  // Set the value at the final key
  current[path[path.length - 1]] = value;
  return obj;
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

// Legend State persist plugin implementation
export const MMKVPersistPluginWrapper: ObservablePersistPlugin = {
  getTable<T>(table: string, init: object, config: PersistOptions): T {
    const key = buildKey(table, config);
    const value = storage.getString(key);
    return safeJsonParse<T>(value, init as T);
  },

  getMetadata(table: string, config: PersistOptions): PersistMetadata {
    const key = buildMetadataKey(table, config);
    const value = storage.getString(key);
    return safeJsonParse<PersistMetadata>(value, {});
  },

  set(table: string, changes: Change[], config: PersistOptions): void {
    const key = buildKey(table, config);
    const existing = storage.getString(key);
    let data = safeJsonParse<Record<string, unknown>>(existing, {});

    // Apply each change to the data object
    for (const { path, valueAtPath } of changes) {
      data = setValueAtPath(data, path, valueAtPath);
    }

    const serialized = safeJsonStringify(data);
    if (serialized) {
      storage.set(key, serialized);
    }
  },

  setMetadata(table: string, metadata: PersistMetadata, config: PersistOptions): Promise<void> {
    const key = buildMetadataKey(table, config);
    const serialized = safeJsonStringify(metadata);

    if (serialized) {
      storage.set(key, serialized);
    }

    return Promise.resolve();
  },

  deleteTable(table: string, config: PersistOptions): void {
    const key = buildKey(table, config);
    storage.delete(key);
  },

  deleteMetadata(table: string, config: PersistOptions): void {
    const key = buildMetadataKey(table, config);
    storage.delete(key);
  },
};
