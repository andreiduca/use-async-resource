import { initializeDataReader } from './dataReaderInitializer';
import { resourceCache } from './cache';
import { suspendFor } from './test.helpers';

describe('initializeDataReader', () => {
  const apiFn = (id: number) => Promise.resolve({ id, name: 'test name' });
  const apiFn2 = (id: number) => Promise.resolve({ id, title: 'some title' });
  const apiFailureFn = (id: number) => Promise.reject(`User ${id} not found`);

  afterEach(() => {
    resourceCache(apiFn).clear();
    resourceCache(apiFailureFn).clear();
  });

  it('should create a new data reader', async () => {
    const dataReader = initializeDataReader(apiFn, 1);

    // "Suspend" until the promise is fulfilled
    await suspendFor(dataReader);

    // now we should be able to get the raw data from the function
    expect(dataReader()).toStrictEqual({ id: 1, name: 'test name' });
  });

  it('should create an erroneous data reader', async () => {
    const dataReader = initializeDataReader(apiFailureFn, 1);

    // "Suspend" until the promise is fulfilled
    await suspendFor(dataReader);

    // the data reader should throw an error because the promise failed
    expect(dataReader).toThrowError(Error('User 1 not found'));
  });

  it('a data reader should accept an optional modifier function', async () => {
    const dataReader = initializeDataReader(apiFn, 1);
    await suspendFor(dataReader);

    // a "modifier" function
    // only returns the id of the user
    function getId(user: { id: number, name: string }) {
      return user.id;
    }

    // should only return the user id
    expect(dataReader(getId)).toStrictEqual(1);
  });

  it('a data reader should be cached and reused', async () => {
    const dataReader = initializeDataReader(apiFn, 1);
    await suspendFor(dataReader);

    // initialize a new data reader with the same params
    const similarDataReader = initializeDataReader(apiFn, 1);

    // because it was previously cached, the new data reader is immediately available as a synchronous read
    expect(similarDataReader).not.toThrow();

    // ...and it's actually the exact same function as the previous data reader
    expect(similarDataReader).toStrictEqual(dataReader);
  });

  it('a cached data reader should be unique', async () => {
    const dataReader = initializeDataReader(apiFn, 1);
    await suspendFor(dataReader);

    // initializing with other params
    const dataReader2 = initializeDataReader(apiFn, 2);
    // we will need to wait for it to resolve
    await suspendFor(dataReader2);

    // the resulting data reader is different than the previous one
    expect(dataReader2).not.toStrictEqual(dataReader);
    expect(dataReader2(u => u.id)).toStrictEqual(2);


    // initializing from a different api function, but same params
    const dataReader3 = initializeDataReader(apiFn2, 1);
    // we also need to wait for it to resolve
    await suspendFor(dataReader3);

    // the resulting data reader is different than everything cached before
    expect(dataReader3).not.toStrictEqual(dataReader);
    // as well as the data returned
    expect(dataReader3()).not.toStrictEqual(dataReader());
  });

  it('clearing the cache should not reuse the data reader', async () => {
    const dataReader = initializeDataReader(apiFn, 1);
    await suspendFor(dataReader);

    // clear the cache for this resource
    resourceCache(apiFn, 1).delete();

    // initialize a new data reader with the same params
    const similarDataReader = initializeDataReader(apiFn, 1);
    // the new data reader has to resolve
    await suspendFor(similarDataReader);

    // the data readers are different function
    expect(similarDataReader).not.toStrictEqual(dataReader);

    // ...but the data returned should be the same
    expect(similarDataReader()).toStrictEqual(dataReader());
  });
});
