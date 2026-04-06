'use strict';

module.exports = {
  useValue: (source) =>
    source && typeof source === 'object' && 'get' in source && typeof source.get === 'function'
      ? source.get()
      : source,
};
