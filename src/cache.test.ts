import { DataOrModifiedFn } from './types';
import { resourceCache } from './cache';

describe('resourceCache', () => {
  const apiFn = (_: number) => Promise.resolve(true);

  it('should not get a cached resource', async () => {
    expect(resourceCache(apiFn).get()).toBe(undefined);
    expect(resourceCache(apiFn, 1).get()).toBe(undefined);
  });

  it('should cache a new resource', async () => {
    function getData() { return true; }
    resourceCache(apiFn, 1).set(getData as DataOrModifiedFn<boolean>);

    expect(resourceCache(apiFn, 1).get()).toBe(getData);
  });

  it('should delete a cached resource', async () => {
    function getData() { return true; }
    resourceCache(apiFn, 1).set(getData as DataOrModifiedFn<boolean>);

    resourceCache(apiFn, 1).delete();
    expect(resourceCache(apiFn, 1).get()).toBe(undefined);
  });

  it('should clear all cached resources', async () => {
    function getData1() { return true; }
    function getData2() { return true; }
    resourceCache(apiFn, 1).set(getData1 as DataOrModifiedFn<boolean>);
    resourceCache(apiFn, 2).set(getData2 as DataOrModifiedFn<boolean>);

    expect(resourceCache(apiFn, 1).get()).toBe(getData1);
    expect(resourceCache(apiFn, 2).get()).toBe(getData2);

    resourceCache(apiFn).clear();

    expect(resourceCache(apiFn, 1).get()).toBe(undefined);
    expect(resourceCache(apiFn, 2).get()).toBe(undefined);
  });

  it('should not collide with other api functions', async () => {
    const apiFn2 = (_: number) => Promise.resolve(true);
    function getData() { return true; }

    resourceCache(apiFn, 1).set(getData as DataOrModifiedFn<boolean>);

    expect(resourceCache(apiFn, 1).get()).toBe(getData);
    expect(resourceCache(apiFn2, 1).get()).toBe(undefined);
  });
});
