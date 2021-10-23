// @ts-ignore
import hash from 'object-hash';
import { ApiFn, DataOrModifiedFn } from './types';

// keep separate caches for each api function
const caches = new Map();

// todo: implement a LRU maybe?

// A simple resource cache helper.
// Caches are kept individually for each api function.
export function resourceCache<R, A extends unknown[]>(apiFn: ApiFn<R, A>) {
  // initialize a new cache for this api function if it doesn't exist
  if (!caches.has(apiFn)) {
    caches.set(apiFn, new Map());
  }

  // get the cache for this api function
  const apiCache: Map<string, DataOrModifiedFn<R>> = caches.get(apiFn);

  // return an object with helper methods to manage the cache for this api function
  return {
    // gets the cached data reader for the given params
    get(...params: A | never[]) {
      return apiCache.get(hash(params));
    },
    // caches the data reader for the given params
    set(dataFn: DataOrModifiedFn<R>, ...params: A | never[]) {
      return apiCache.set(hash(params), dataFn);
    },
    // deletes the cached data reader for the given params
    delete(...params: A | never[]) {
      return apiCache.delete(hash(params));
    },
    // clears the entire cache for this api function
    clear() {
      caches.delete(apiFn);
      return apiCache.clear();
    },
  };
}
