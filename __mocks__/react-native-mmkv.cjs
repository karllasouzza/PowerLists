/**
 * Manual mock for react-native-mmkv.
 * Provides an in-memory implementation of MMKV suitable for Jest tests.
 */

function createMMKVInstance() {
  const store = new Map();

  return {
    getString: (key) => store.get(key) ?? undefined,
    set: (key, value) => store.set(key, value),
    delete: (key) => store.delete(key),
    contains: (key) => store.has(key),
    getAllKeys: () => Array.from(store.keys()),
    clearAll: () => store.clear(),
    addOnValueChangedListener: () => ({ remove: () => {} }),
  };
}

module.exports = {
  createMMKV: jest.fn(() => createMMKVInstance()),
  MMKV: jest.fn().mockImplementation(createMMKVInstance),
};
