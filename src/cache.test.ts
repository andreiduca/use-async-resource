import { DataOrModifiedFn } from './types';
import { resourceCache } from './cache';

describe('resourceCache', () => {
  const apiFn = (_: number) => Promise.resolve(true);

  it('should not get a cached resource', async () => {
    expect(resourceCache(apiFn).get()).toBe(undefined);
    expect(resourceCache(apiFn).get(1)).toBe(undefined);
  });

  it('should cache a new resource', async () => {
    function getData() { return true; }
    resourceCache(apiFn).set(getData as DataOrModifiedFn<boolean>, 1);

    expect(resourceCache(apiFn).get(1)).toBe(getData);
  });

  it('should delete a cached resource', async () => {
    function getData() { return true; }
    resourceCache(apiFn).set(getData as DataOrModifiedFn<boolean>, 1);

    resourceCache(apiFn).delete(1);
    expect(resourceCache(apiFn).get(1)).toBe(undefined);
  });

  it('should clear all cached resources', async () => {
    function getData1() { return true; }
    function getData2() { return true; }
    resourceCache(apiFn).set(getData1 as DataOrModifiedFn<boolean>, 1);
    resourceCache(apiFn).set(getData2 as DataOrModifiedFn<boolean>, 2);

    expect(resourceCache(apiFn).get(1)).toBe(getData1);
    expect(resourceCache(apiFn).get(2)).toBe(getData2);

    resourceCache(apiFn).clear();

    expect(resourceCache(apiFn).get(1)).toBe(undefined);
    expect(resourceCache(apiFn).get(2)).toBe(undefined);
  });

  it('should not collide with other api functions', async () => {
    const apiFn2 = (_: number) => Promise.resolve(true);
    function getData() { return true; }

    resourceCache(apiFn).set(getData as DataOrModifiedFn<boolean>, 1);

    expect(resourceCache(apiFn).get(1)).toBe(getData);
    expect(resourceCache(apiFn2).get(1)).toBe(undefined);
  });
});
