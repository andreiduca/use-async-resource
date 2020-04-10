// @ts-ignore
import hash from 'object-hash';
import { ApiFn, DataOrModifiedFn } from './types';

// keep separate caches for each api function
const caches = new Map();

// todo: implement a LRU maybe?

// A simple resource cache helper.
// Caches are kept individually for each api function.
export function resourceCache<R, A extends any[]>(
  apiFn: ApiFn<R, A>,
  ...params: A | never[]
) {
  // initialize a new cache for this api function if it doesn't exist
  if (!caches.has(apiFn)) {
    caches.set(apiFn, new Map());
  }

  // get the cache for this api function
  const apiCache: Map<string, DataOrModifiedFn<R>> = caches.get(apiFn);
  // pre-compute the key for the requested object
  const pKey = hash(params);

  // return an object with helper methods to manage the cache for this api function and the given params
  return {
    // gets the cache for the computed key
    get() {
      return apiCache.get(pKey);
    },
    // sets the cache for the computed key
    set(data: DataOrModifiedFn<R>) {
      return apiCache.set(pKey, data);
    },
    // deletes the cache for the computed key
    delete() {
      return apiCache.delete(pKey);
    },
    // clears the entire cache for this api function
    clear() {
      caches.delete(apiFn);
      return apiCache.clear();
    },
  };
}
