import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/dom';

import { useAsyncResource } from './useAsyncResource';
import { resourceCache } from './cache';
import { initializeDataReader as preloadResource } from './dataReaderInitializer';
import { suspendFor } from './test.helpers';

describe('useAsyncResource', () => {
  const apiFn = (id: number) => Promise.resolve({ id, name: 'test name' });
  const apiSimpleFn = () => Promise.resolve({ message: 'success' });

  afterEach(() => {
    resourceCache(apiFn).clear();
    resourceCache(apiSimpleFn).clear();
  });

  it('should create a new data reader', async () => {
    // get the data reader from the custom hook, with params
    const { result } = renderHook(() => useAsyncResource(apiFn, 1));
    const [dataReader] = result.current;

    // wait for it to fulfill
    await suspendFor(dataReader);

    // should be able to get raw data from the data reader
    expect(dataReader()).toStrictEqual({ id: 1, name: 'test name' });

    // same for api functions without params
    const { result: simpleResult } = renderHook(() => useAsyncResource(apiSimpleFn, []));
    const [simpleData] = simpleResult.current;
    await suspendFor(simpleData);
    expect(simpleData()).toStrictEqual({ message: 'success' });
  });

  it('should trigger an update for the data reader', async () => {
    // get the data reader and the updater function from the custom hook
    const { result } = renderHook(() => useAsyncResource(apiFn, 1));
    const [dataReader, updateDataReader] = result.current;

    // wait for it to fulfill
    await suspendFor(dataReader);

    // make sure we're able to get raw data from it
    expect(dataReader(u => u.id)).toStrictEqual(1);

    // call the updater function with new params
    act(() => updateDataReader(2));

    // this should generate a brand new data reader
    const [newDataReader] = result.current;
    // we will need to wait for its fulfillment
    await suspendFor(newDataReader);

    // check that it's indeed a new one
    expect(newDataReader).not.toStrictEqual(dataReader);
    // and that it returns different data
    expect(newDataReader(u => u.id)).toStrictEqual(2);
  });

  it('should reuse a cached data reader', async () => {
    // get the data reader and the updater function from the custom hook
    const { result } = renderHook(() => useAsyncResource(apiFn, 1));
    const [dataReader, updateDataReader] = result.current;

    // wait for it to fulfill
    await suspendFor(dataReader);

    // call the updater function with new params
    act(() => updateDataReader(2));

    // this should generate a brand new data reader
    const [newDataReader] = result.current;
    // we will need to wait for its fulfillment
    await suspendFor(newDataReader);

    // call the updater one more time, but with the previous param
    act(() => updateDataReader(1));

    // the new data reader should use the previously cached version
    const [cachedDataReader] = result.current;
    // so nothing to wait for
    expect(cachedDataReader).not.toThrow();

    // make sure it's the exact same as the very first one
    expect(cachedDataReader).toStrictEqual(dataReader);
    // and that it returns the same data
    expect(cachedDataReader(u => u.id)).toStrictEqual(1);
  });

  it('should create a lazy data reader', async () => {
    // initialize a lazy data reader
    const { result } = renderHook(() => useAsyncResource(apiFn));
    const [dataReader, updateDataReader] = result.current;

    // it should be available immediately, but should return `undefined`
    expect(dataReader).not.toThrow();
    expect(dataReader()).toStrictEqual(undefined);

    // triggering an api call
    act(() => updateDataReader(1));
    const [updatedDataReader] = result.current;

    // requires waiting for a fulfillment
    await suspendFor(updatedDataReader);

    // finally, we should have some data available
    expect(updatedDataReader(u => u.id)).toStrictEqual(1);
  });

  it('should call the api function again if the cache is cleared', async () => {
    // get the data reader and the updater function from the custom hook
    const { result } = renderHook(() => useAsyncResource(apiFn, 1));
    const [dataReader, updateDataReader] = result.current;
    await suspendFor(dataReader);

    // clear the cache before calling the updater with the previous param
    resourceCache(apiFn).delete(1);

    // call the updater function with same params
    act(() => updateDataReader(1));
    // this should generate a brand new data reader
    const [newDataReader] = result.current;
    // and we will need to wait for its fulfillment
    await suspendFor(newDataReader);

    // make sure it's different than the first one
    expect(newDataReader).not.toStrictEqual(dataReader);
    // but that it returns the same data
    expect(newDataReader(u => u.id)).toStrictEqual(1);
  });

  it('should trigger new api calls if the params of the hook change', async () => {
    // get the data reader and the updater function, injecting a prop that we'll update later
    const { result, rerender } = renderHook(
      ({ paramId }) => useAsyncResource(apiFn, paramId),
      { initialProps: { paramId: 1 }},
    );

    // check that it suspends and it resolves with the expected data
    let [dataReader] = result.current;
    await suspendFor(dataReader);
    expect(dataReader()).toStrictEqual({ id: 1, name: 'test name' });

    // re-render with new props
    rerender({ paramId: 2 });

    // check that it suspends again and renders with new data
    const [newDataReader] = result.current;
    await suspendFor(newDataReader);
    expect(newDataReader()).toStrictEqual({ id: 2, name: 'test name' });
  });

  it('should persist the data reader between renders - for api function with params', async () => {
    // get the data reader and the updater function
    const { result, rerender } = renderHook(
      ({ paramId }) => useAsyncResource(apiFn, paramId),
      { initialProps: { paramId: 1 }},
    );

    // check that it suspends and it resolves with the expected data
    let [dataReader] = result.current;
    await suspendFor(dataReader);
    expect(dataReader()).toStrictEqual({ id: 1, name: 'test name' });

    // re-render with same props
    rerender({ paramId: 1 });

    // check that it doesn't suspend again and the data reader is reused
    const [newDataReader] = result.current;
    expect(newDataReader).toStrictEqual(dataReader);
  });

  it('should persist the data reader between renders - for api function without params', async () => {
    // get the data reader and the updater function
    const { result, rerender } = renderHook(() => useAsyncResource(apiSimpleFn, []));

    // check that it suspends and it resolves with the expected data
    let [dataReader] = result.current;
    await suspendFor(dataReader);
    expect(dataReader()).toStrictEqual({ message: 'success' });

    // render again
    rerender();

    // check that it doesn't suspend again and the data reader is reused
    const [newDataReader] = result.current;
    expect(newDataReader()).toStrictEqual(dataReader());
    // expect(newDataReader).toStrictEqual(dataReader);
  });

  it('should preload a resource before rendering', async () => {
    // start preloading the resource
    preloadResource(apiSimpleFn);

    // expect the resource to load faster than the component that will consume it
    const preloadedResource = resourceCache(apiSimpleFn).get();
    if (preloadedResource) {
      await waitFor(() => preloadedResource());
    }

    // a component consuming the preloaded resource should have the data readily available
    const { result } = renderHook(() => useAsyncResource(apiSimpleFn, []));
    let [dataReader] = result.current;
    expect(dataReader()).toStrictEqual({ message: 'success' });
  });
});
